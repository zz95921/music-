var audio = document.querySelector('audio')

//歌曲名称
var title = document.querySelector('h2')

//歌手
var singer = document.querySelector('h4')

//歌手头像
var avatar = document.querySelector('.avatar div')

//播放按钮(其实是一个img)
var playButton = document.querySelector('.playControl img:nth-of-type(2)')

//播放进度
var progress = document.querySelector('.timeControl input')

//显示播放时长的span
var currentTimeSpan = document.querySelector('.timeControl span:first-child')

//显示总时长的span
var totleTimeSpan = document.querySelector('.timeControl span:last-child')
	
//音量进度条
var voice = document.querySelector('.volumeControl input')	

//歌词
var p = document.querySelector('.lrc p')

//记录歌曲的编号
var listIndex = 0

//判断是否在拖动进度条
var isDrag = false

//当前歌曲的歌词
var currentLrc = 0

//当前显示的这一行歌词
var lrcLine = 0
audio.volume = 0.5
voice.value = 50
//创建歌单
var list = [{
	name: '知道不知道',
	singer: '刘若英',
	avatar: 'img/lry.jpg',
	src: 'mp3/知道不知道.mp3'
}, {
	name: '传奇',
	singer: '王菲',
	avatar: ' img/wf.png',
	src: 'mp3/传奇.mp3'
}]

//直接播放
playTheSong()

/*
 * 上一曲
 */
function prev() {

	//alert('上一曲')
	listIndex--
	switchToTheSong()
}

/*
 * 下一曲
 */
function next() {

	//alert('下一曲')
	listIndex++
	switchToTheSong()
}
/*
 * 暂停/播放
 */
function playOrPause() {

	//alert('暂停/播放')
	//audio.paused:判断是否暂停
	if(audio.paused) {
		//播放
		audio.play()

		playButton.src = 'img/play.png'
		
		//animationPlayState控制动画的状态，paused：暂停动画
		avatar.style.animationPlayState = ''
	} else {
		//暂停
		audio.pause()

		playButton.src = 'img/pause.png'
		
		avatar.style.animationPlayState = 'paused'
	}
}
/*
 * 负责切换歌曲
 */
function switchToTheSong() {

	if(listIndex > 1) {

		listIndex = 0
	}
	if(listIndex < 0) {

		listIndex = 1
	}
	//根据歌曲编号找到对应的歌曲对象
	var aSong = list[listIndex]

	playTheSong(aSong)

	renderTheView(aSong)
	//lrcs[aSong.name]
}

/*
 * 负责播放歌曲
 */
function playTheSong(aSong) {

	var song = aSong || list[0]

	audio.src = song.src

	audio.load()

	audio.play()

	avatar.style.animationName = 'rotate'
	
	avatar.style.animationDuration = '10s'
	
	avatar.style.animationTimingFunction = 'linear'
	
	avatar.style.animationIterationCount = 'infinite'
	
	//获取当前歌曲对应的歌词
	currentLrc = lrcs[song.name]
}
/*
 * 重新渲染歌曲页面
 */

function renderTheView(aSong) {

	title.innerHTML = aSong.name

	singer.innerHTML = aSong.singer

	avatar.style.backgroundImage = 'url(' + aSong.avatar + ')'

	playButton.src = 'img/play.png'
	
}
/*
 * 拖动修改播放进度
 */
function changeTheProgress() {

	//alert(progress.value)
	//根据进度条进度设置当前的播放进度
	audio.currentTime = progress.value
}
/*
 * 监听audio播放进度更新的事件
 */
audio.ontimeupdate = function() {
		console.log(audio.currentTime)
		console.log(audio.duration)
			//audio.duration获取audio当前播放的资源文件的总时长(单位：秒)
			//audio.currentTime:获取audio当前播放的资源文件已经播放的时长(单位：秒)

		//防止歌曲播放过程中不停刷新总时间
		if(audio.duration != progress.max) {

			//设置进度条的最大值为总时长
			progress.max = Math.ceil(audio.duration)
				//设置总时长的时间格式
			totleTimeSpan.innerHTML = myTimeFormatter(audio.duration)
		}

		//设置进度条的当前value为音乐播放的进度
		//if(!isDrag)
		if(isDrag == false){
			progress.value = audio.currentTime
		}
		
		//自动下一曲
		if(audio.currentTime == audio.duration){
			
			next()
			return
		}
		
		var currTime = myTimeFormatter(audio.currentTime)

		//设置播放的时间格式
		currentTimeSpan.innerHTML = currTime
		
		//显示歌词
		showLrcs(audio.currentTime)

}

/*
 * 点击进度条，拖动的时候
 */
progress.onmousedown = function(){
	
	isDrag = true
}
/*
 * 松开进度条，停止拖动
 */
progress.onmouseup = function(){
	
	isDrag = false
}
/*
 * mouseMove:是鼠标移动的事件
 */
progress.onmousemove = function(){
	
	//判断是否是在拖拽进度条
	if(isDrag){
		
		audio.currentTime = progress.value
		
		currentTimeSpan.innerHTML =myTimeFormatter(audio.currentTime) 
		
	}
}
	/*
	 * 时间格式器
	 */
function myTimeFormatter(aTime) {

	//Math.floor(n)向下取整，即取不大于n的第一个整数
	//Math.ceil(n)向上取整，即取不小于n的第一个整数
	//把秒数转化为分钟
	var minutes = Math.floor(aTime / 60)

	//parseInt()对某一个数取整（四舍五入）
	var seconds = parseInt(aTime) % 60

	minutes = minutes < 10 ? '0' + minutes : minutes

	seconds = seconds < 10 ? '0' + seconds : seconds

	return minutes + ':' + seconds
		//console.log(minutes)
}
/*
 * 显示对应的歌词
 */
function showLrcs(aTime){
	
	//当前播放的进度+延迟时间=歌词出来的事件
	var offset = currentLrc.offset
	
	var currentTime = aTime + offset
	
	currentTime = myTimeFormatter(currentTime)
	
	for(var keys in currentLrc){
		
		if(keys == currentTime){
			
			 lrcLine = currentLrc[keys]
			 
			if(lrcLine == ''){
				
				lrcLine = '...'
			}
		  
			
		}
		
		p.innerHTML = lrcLine
	}
	
	
}
/*
 * 拖动之后 获取进度
 */
voice.onchange = function(e){
	//设置音量
	audio.volume = e.target.value / 100
	//alert(e.target.value)
}
