<template>
	<scroll>
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<uL>
					<li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
						<img class="avatar" v-lazy="item.avatar">
						<span class="name">{{item.name}}</span>
					</li>
				</uL>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
			<ul>
				<li v-for="(item, index) in shortcutList" :data-index="index" class="item" :class="{'current':currentIndex === index}">{{item}}</li>
			</ul>
		</div>
		<div class="list-fixed" ref="fixed" v-show="fixedTitle">
			<div class="fixed-title">{{fixedTitle}}</div>
		</div>
		<div v-show="!data.length" class="loading-container">
			<loading></loading>
		</div>
	</scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {
	getData
} from 'common/js/dom'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default {
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	computed: {
		shortcutList() {
			return this.data.map((group) => {
				return group.title.substr(0, 1)
			})
		},
		fixedTitle() {
			// 固定title实现
			if (this.scrollY > 0) {
				return ''
			}
			return this.data[this.currentIndex]
		}
	},
	data() {
		return {
			scrollY: -1,
			currentIndex: 0,
			diff: -1
		}
	},
	methods: {
		selectItem(item) {
			this.$emit('select', item)
		},
		onShortcutTouchStart(e) {
			// 获取点击元素的索引
			let anchorIndex = getData(e.target, 'index')
			let firstTouch = e.touches[0]
			// 获取手指的位置
			this.touch.y1 = firstTouch.pageY
			// 手指触摸开始的索引
			this.touch.anchorIndex = anchorIndex
			this._scrollTo(anchorIndex)
		},
		onShortcutTouchMove(e) {
			let firstTouch = e.touches[0]
			this.touch.y2 = firstTouch.pageY
			// y轴偏移量
			let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
			let anchorIndex = parseInt(this.touch.anchorIndex) + delta
			this._scrollTo(anchorIndex)
		},
		refresh() {
			this.$refs.listview.refresh()
		},
		scroll(pos) {
			this.scrollY = pos.y
		},
		_calculateHeight() {
			// 计算每一个listGroup的高度
			this.listHeight = []
			const list = this.$refs.listGroup
			let height = 0
			this.listHeight.push(height)
			for (let i = 0; i < list.length; i++) {
				let item = list[i]
				height += item.clientHeight
				this.listHeight.push(height)
			}
		},
		_scrollTo(index) {
			if (!index && index !== 0) {
				return
			}
			if (index < 0) {
				index = 0
			} else if (index > this.listHeight.length - 2) {
				index = this.listHeight.length - 2
			}
			this.scrollY = -this.listHeight[index]
			// 根据索引对应滚动到相应的位置，实现左右联动效果.
			this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
		}
	},
	watch: {
		data() {
			setTimeout(() => {
				this._calculateHeight()
			}, 20)
		},
		scrollY(newY) {
			const listHeight = this.listHeight
			// 当滚动到顶部，newY>0
			if (newY > 0) {
				this.currentIndex = 0
				return
			}
			// 在中间部分滚动
			for (let i = 0; i < listHeight.length - 1; i++) {
				let height1 = listHeight[i]
				let height2 = listHeight[i + 1]
				if (-newY >= height1 && -newY < height2) {
					this.currentIndex = i
					this.diff = height2 + newY
					console.info(this.diff)
					return
				}
			}
			// 当滚动到底部，且-newY大于最后一个元素的上限
			this.currentIndex = listHeight.length - 2
		},
		diff(newVal) {
			let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
			if (this.fixedTop === fixedTop) {
				return
			}
			this.fixedTop = fixedTop
			this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
		}
	},
	components: {
		Scroll,
		Loading
	}
}
</script>

<style lang="stylus"></style>