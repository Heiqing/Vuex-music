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
export default {
	components: {
		Scroll,
		Loading
	}
}
</script>

<style lang="stylus"></style>