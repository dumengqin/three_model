<style scoped>
	.mask {
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		background-color: rgba(1, 1, 1, 0.5);
		padding-top: 20%;
		text-align: center;
		color: lavender;
		display: none;
	}
	
	.controls-panel {
		display: inline-block;
		position: absolute;
		color: #fff;
		margin: 10px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		background-color: rgba(0, 0, 0, .5);
		padding: 5px;
		border-radius: 2px;
		right: 0px;
	}
	
	.controls-panel .a {
		width: 150px;
		text-align: center;
		border: 1px solid;
		border-radius: 50%;
		display: inline-block;
	}
	
	.controls-panel .b {
		width: 100px;
		height: 153px;
		display: inline-block;
		text-align: center;
		border-bottom: 1px solid;
		border-right: 1px solid;
	}
	
	.controls-panel .a .row {
		margin-bottom: inherit;
		line-height: 50px;
		height: 50px;
	}
	
	.controls-panel .b .row {
		margin-bottom: inherit;
		line-height: 75px;
		height: 75px;
	}
	
	.controls-panel .b .row .col {
		border: 1px solid;
		border-bottom: inherit;
		border-right: inherit;
	}
	
	.controls-panel .c {
		border: 1px solid;
		padding: 10px;
		text-align: center;
		cursor: pointer;
	}
	
	.controls-panel .c .button:hover {
		color: #2196F3;
	}
	
	.row {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20px;
	}
	
	.row .col.s4 {
		width: 33.3333333333%;
	}
	
	.row .col.s3,
	.row .col.s4 {
		margin-left: auto;
		left: auto;
		right: auto;
	}
	
	.row .col.s6 {
		width: 50%;
	}
	
	.row .col.s5,
	.row .col.s6 {
		margin-left: auto;
		left: auto;
		right: auto;
	}
	
	.row .col {
		float: left;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding: 0 .75rem;
		min-height: 1px;
	}
	
	.row .col {
		padding: 0!important;
	}
	
	.row .col i {
		cursor: pointer;
	}
	
	.row .col i:hover {
		color: #2196F3;
	}
	
	.console-log {
		position: fixed;
		top: 0px;
		left: 0px;
		color: white;
	}
</style>
<template>
	<div>
		<div class="controls-panel">
			<div class="a">
				<div class="row">
					<div class="col s4"><i class="iconfont">&nbsp;</i></div>
					<div class="col s4" v-on:click="obj_up"><i class="iconfont">&#xe62d;</i></div>
					<div class="col s4"><i class="iconfont">&nbsp;</i></div>
				</div>
				<div class="row">
					<div class="col s4" v-on:click="obj_left"><i class="iconfont">&#xe75d;</i></div>
					<div class="col s4"><i class="iconfont">&nbsp;</i></div>
					<div class="col s4" v-on:click="obj_right"><i class="iconfont">&#xe75c;</i></div>
				</div>
				<div class="row">
					<div class="col s4"><i class="iconfont">&nbsp;</i></div>
					<div class="col s4" v-on:click="obj_down"><i class="iconfont">&#xe75e;</i></div>
					<div class="col s4"><i class="iconfont">&nbsp;</i></div>
				</div>
			</div>
			<div class="b">
				<div class="row">
					<div class="col s6" v-on:click="obj_zoom_in"><i class="iconfont">&#xe62f;</i></div>
					<div class="col s6" v-on:click="obj_front"><i class="iconfont">&#xe630;</i></div>
				</div>
				<div class="row">
					<div class="col s6" v-on:click="obj_zoom_out"><i class="iconfont">&#xe62e;</i></div>
					<div class="col s6" v-on:click="obj_behind"><i class="iconfont">&#xe631;</i></div>
				</div>
			</div>
			<div class="c">
				<div class="button" v-on:click="click_add_obj">动态添加标识对象</div>
			</div>
		</div>
		<div ref="mask" class="mask">
		</div>
		<tooltip ref="tooltip"></tooltip>
		<div class="console-log" v-show="console_log.length>0" v-html="console_log"></div>
	</div>
</template>

<script>
	require("../com/OBJLoader");
	require("../com/OrbitControls");
	require("../com/Projector");
	require("../com/CanvasRenderer");
	var tooltip = require("../components/tooltip.vue");

	module.exports = {
		data: function() {
			return {
				//3d params
				container: null,
				camera: null,
				scene: null,
				renderer: null,
				controls: null,
				fov: 45, //拍摄距离
				near: 1, //最小范围
				far: 1000, //最大范围
				sphere: [],
				raycaster: null,
				select_obj: null,
				console_log: ""
			}
		},
		components: {
			'tooltip': tooltip
		},
		methods: {
			click_add_obj: function() {
				this.add_obj(null);
			},
			main_model_load: function(obj_url, img_url, container_dom, mask_dom) {
				var vm_this = this;
				vm_this.container = document.createElement('div');
				document.body.appendChild(vm_this.container);
				//              vm_this.container = container_dom;
				mask_dom.style.display = "inherit";
				mask_dom.innerText = "模型加载中请稍后……";
				vm_this.camera = new THREE.PerspectiveCamera(vm_this.fov, window.innerWidth / window.innerHeight, vm_this.near, vm_this.far);
				vm_this.camera.position.set(0, 350, 350);
				//照相机默认是沿着z轴负方向观察的，改为（10,10,10）这个观察点后肯定看到的是一片漆黑
				vm_this.camera.lookAt(new THREE.Vector3(0, 0, 0));
				vm_this.controls = new THREE.OrbitControls(vm_this.camera);

				// scene
				vm_this.scene = new THREE.Scene();
				vm_this.scene.add(new THREE.AmbientLight(0x101030));

				// texture
				var manager = new THREE.LoadingManager();
				manager.onProgress = function(item, loaded, total) {
					console.log(item, loaded, total);
				};
				var texture = new THREE.Texture();
				var onProgress = function(xhr) {
					if(xhr.lengthComputable) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						mask_dom.innerText = "模型加载中请稍后……" + Math.round(percentComplete, 2) + '%';
						if(Math.round(percentComplete, 2) >= 99) {
							mask_dom.innerText = "模型加载完成，即将呈现……";
						}
					}
				};
				var onError = function(xhr) {
					mask_dom.innerText = "模型加载失败！";
				};
				var loader = new THREE.ImageLoader(manager);
				loader.load(img_url, function(image) {
					texture.image = image;
					texture.needsUpdate = true;
				});

				// model
				var loader = new THREE.OBJLoader(manager);
				loader.load(obj_url, function(object) {
					object.traverse(function(child) {
						if(child instanceof THREE.Mesh) {
							child.material.map = texture;
						}
					});
					vm_this.scene.add(object);
					mask_dom.style.display = "none";
					//将创建好的几何体加入到场景中
				}, onProgress, onError);

				vm_this.renderer = new THREE.WebGLRenderer();
				vm_this.renderer.setPixelRatio(window.devicePixelRatio);
				vm_this.renderer.setSize(window.innerWidth, window.innerHeight);
				vm_this.container.innerHTML = "";
				vm_this.container.appendChild(vm_this.renderer.domElement);

				// lights
				var light = new THREE.DirectionalLight(0xbcbcbc);
				light.position.set(1, 1, 1);
				vm_this.scene.add(light);

				var light = new THREE.DirectionalLight(0xbcbcbc);
				light.position.set(-1, -1, -1);
				vm_this.scene.add(light);

				var light = new THREE.AmbientLight(0xbcbcbc);
				vm_this.scene.add(light);

				window.addEventListener('resize', vm_this.onResize, false);
				window.addEventListener("mousemove", vm_this.onMousemove);
				window.addEventListener("mousedown", vm_this.onMousedown);
				vm_this.animate();
			},
			onResize: function() {
				var vm_this = this;
				vm_this.camera.aspect = window.innerWidth / window.innerHeight;
				vm_this.camera.updateProjectionMatrix();
				vm_this.renderer.setSize(window.innerWidth, window.innerHeight);
			},
			onMousemove: function(e) {
				var vm_this = this;
				e.preventDefault();
				//将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
				var mouse = new THREE.Vector2();
				mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
				mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
				//新建一个三维单位向量 假设z方向就是0.5
				//根据照相机，把这个向量转换到视点坐标系
				var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(vm_this.camera);
				//在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
				var raycaster = new THREE.Raycaster(vm_this.camera.position, vector.sub(vm_this.camera.position).normalize());
				//射线和模型求交，选中一系列直线
				var intersects = raycaster.intersectObjects(vm_this.scene.children);

				if(intersects.length > 0) {
					//选中第一个射线相交的物体

					vm_this.select_obj = intersects[0].object;
					vm_this.$refs.tooltip.show(vm_this.select_obj.name, e.clientX, e.clientY);

				} else {

					vm_this.$refs.tooltip.hide();
				}
			},
			onMousedown: function(e) {
				var vm_this = this;
				e.preventDefault();
				//将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
				var mouse = new THREE.Vector2();
				mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
				mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
				//新建一个三维单位向量 假设z方向就是0.5
				//根据照相机，把这个向量转换到视点坐标系
				var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(vm_this.camera);
				//在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
				var raycaster = new THREE.Raycaster(vm_this.camera.position, vector.sub(vm_this.camera.position).normalize());
				//射线和模型求交，选中一系列直线
				var intersects = raycaster.intersectObjects(vm_this.scene.children);

				if(intersects.length > 0) {
					//选中第一个射线相交的物体
					vm_this.select_obj = intersects[0].object;
					vm_this.console_log += "你点击了“" + vm_this.select_obj.name + "”" + "<br/>";

				}
			},
			animate: function() {
				var vm_this = this;
				requestAnimationFrame(vm_this.animate);
				vm_this.render();
			},
			render: function() {
				var vm_this = this;
				vm_this.renderer.render(vm_this.scene, vm_this.camera);
			},
			add_obj: function(param) {
				var vm_this = this;
				var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 10), new THREE.MeshLambertMaterial({
					color: 0xff0000
				})); //材质设定
				if(param != null) {
					sphere.position.set(param.position.x, param.position.y, param.position.z);
					sphere.scale.set(param.scale.x, param.scale.y, param.scale.z);
				} else {
					sphere.position.set(0, 80, 0);
				}
				sphere.name = "这是个圆";
				vm_this.sphere.push(sphere);
				vm_this.scene.add(sphere);
				vm_this.select_obj = sphere;
			},
			obj_up: function(event) {
				if(this.select_obj != null) {
					var offset = 2.0;
					if(event.ctrlKey) {
						offset = 0.2;
					}
					this.select_obj.position.set(this.select_obj.position.x, this.select_obj.position.y + offset, this.select_obj.position.z);
				}
			},
			obj_down: function(event) {
				if(this.select_obj != null) {
					var offset = 2.0;
					if(event.ctrlKey) {
						offset = 0.2;
					}
					this.select_obj.position.set(this.select_obj.position.x, this.select_obj.position.y - offset, this.select_obj.position.z);
				}
			},
			obj_left: function(event) {
				if(this.select_obj != null) {
					var offset = 2.0;
					if(event.ctrlKey) {
						offset = 0.2;
					}
					this.select_obj.position.set(this.select_obj.position.x - offset, this.select_obj.position.y, this.select_obj.position.z);
				}
			},
			obj_right: function(event) {
				if(this.select_obj != null) {
					var offset = 2.0;
					if(event.ctrlKey) {
						offset = 0.2;
					}
					this.select_obj.position.set(this.select_obj.position.x + offset, this.select_obj.position.y, this.select_obj.position.z);
				}
			},
			obj_front: function(event) {
				if(this.select_obj != null) {
					var offset = 2.0;
					if(event.ctrlKey) {
						offset = 0.2;
					}
					this.select_obj.position.set(this.select_obj.position.x, this.select_obj.position.y, this.select_obj.position.z + offset);
				}
			},
			obj_behind: function(event) {
				if(this.select_obj != null) {
					var offset = 2.0;
					if(event.ctrlKey) {
						offset = 0.2;
					}
					this.select_obj.position.set(this.select_obj.position.x, this.select_obj.position.y, this.select_obj.position.z - offset);
				}
			},
			obj_zoom_in: function(event) {
				if(this.select_obj != null) {
					var offset = 0.2;
					if(event.ctrlKey) {
						offset = 0.02;
					}
					this.select_obj.scale.set(this.select_obj.scale.x + offset, this.select_obj.scale.y + offset, this.select_obj.scale.z + offset);
				}
			},
			obj_zoom_out: function(event) {
				if(this.select_obj != null) {
					var offset = 0.2;
					if(event.ctrlKey) {
						offset = 0.02;
					}
					this.select_obj.scale.set(this.select_obj.scale.x - offset, this.select_obj.scale.y - offset, this.select_obj.scale.z - offset);
				}
			},
		},
		mounted: function() {
			this.main_model_load("http://p2l6ghssy.bkt.clouddn.com/model/model_test.obj", "http://p2l6ghssy.bkt.clouddn.com/model/model_test.jpg", document.body, this.$refs.mask);
		}
	}
</script>