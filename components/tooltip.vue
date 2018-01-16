<style scoped>
	.tooltip{
		position: absolute;
        padding: 5px;
        border: 1px solid white;
        visibility: hidden;
        color: white;
	}
</style>
<template>
	<div class="tooltip" ref="tooltip" v-if="tooltip_msg_data!=null">
		{{tooltip_msg_data}}
	</div>
</template>
<script>
	module.exports = {
        data: function () {
            return {
                tooltip_msg_data:null
            }
        },
        //页面初始化
        mounted: function () {
        },
        //方法
        methods: {
            //显示
            show: function (tooltip_data, position_x, position_y) {
                var vm_this = this;
                vm_this.tooltip_msg_data = tooltip_data;
                if (vm_this.$refs.tooltip != null) {
                    vm_this.$refs.tooltip.style.visibility = "inherit";
                    vm_this.set_tooltip_position(position_x, position_y, vm_this.$refs.tooltip);
                }
            },
            hide: function () {
                var vm_this = this;
                if (vm_this.$refs.tooltip != null) {
                    vm_this.$refs.tooltip.style.visibility = "hidden";
                }
            },
            set_tooltip_position: function (clientX, clientY, tooltip_dom) {
                var marge = 20;
                var coordy = 0;
                var coordx = 0;
                if ((window.innerHeight - clientY - marge) > tooltip_dom.clientHeight) {
                    coordy = clientY + marge;
                } else {
                    coordy = clientY - marge - tooltip_dom.clientHeight;
                }

                if ((window.innerWidth - clientX - marge) > tooltip_dom.clientWidth) {
                    coordx = clientX + marge;
                } else {
                    coordx = clientX - marge - tooltip_dom.clientWidth;
                }
                tooltip_dom.style.top = coordy + "px";
                tooltip_dom.style.left = coordx + "px";
            }
        }
    }
</script>

