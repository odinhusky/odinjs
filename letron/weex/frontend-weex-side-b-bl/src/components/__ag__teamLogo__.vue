<template>
    <div class="__ag__team__">
        <image class="__ag__match-team-a-image__" :class="[resize=='medium'?'__ag__team_medium_image__': resize=='mini'? '__ag__team_mini_image__': '']" v-if="teamFlag" :src="__ag__url__(teamFlag)"></image>
        <div class="__ag__team_content__" :class="[teamType == 1?'__ag__team_a__':'__ag__team_b__',resize=='medium'?'__ag__team_medium_content__': resize=='mini'? '__ag__team_mini_content__': '']" v-else>
            <div class="__ag__assembly_item__" :class="[resize=='medium'?'__ag__team_medium_item__': resize=='mini'? '__ag__team_mini_item__': '']">
                <text class="__ag__assembly-char__" :class="[teamType == 1?'__ag__assembly_a__':'__ag__assembly_b__',resize=='medium'?'__ag__team_medium_assembly__': resize=='mini'? '__ag__team_mini_assembly__': '']">{{ teamName && teamName.charAt(0)}}</text>
            </div>
        </div>
    </div>
</template>
<script>
import agMinUrl from './__ag__minurl__.js'
export default {
    mixins: [agMinUrl], // 使用mixin
    props: {
        dateItem: {
            type: Object,
            default: function() {
                return {}
            }
        },
        teamType: {
            type: Number,
            default: 1
        },
        teamFlag: {
            type: String,
            default: ''
        },
        teamName: {
            type: String,
            default: ''
        },
        resize: {
            type: String,
            default: 'small'
        }
    },

    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>
<style lang="less" scoped>
    .__ag__team__ {
        /* margin-right: 15px; */
    }
    .__ag__match-team-a-image__ {
		width: 47px;
		height: 47px;
		border-radius: 50wx;
	}
    .__ag__team_medium_image__ {
        width: 65px;
        height: 65px;
    }
    .__ag__team_mini_image__ {
        width: 37px;
        height: 37px;
    }
    .__ag__team_content__ {
        width: 47px;
		height: 47px;
		border-radius: 50wx;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 3px;
    }
    .__ag__team_a__ {
        border-style: solid;
        border-width: 3px;
        border-color: rgb(203, 61, 69);
    }
    .__ag__team_b__ {
        border-style: solid;
        border-width: 3px;
        border-color: rgb(74, 136, 224);
    }
    .__ag__team_medium_content__ {
        width: 68px;
        height: 68px;
        padding: 4px;
    }
    .__ag__team_mini_content__ {
        width: 37px;
        height: 37px;
        padding: 2px;
        border-width: 2px;
    }
    
    .__ag__assembly_item__ {
        width: 35px;
		height: 35px;
        border-radius: 50wx;
    }
    .__ag__team_medium_item__ {
        width: 56px;
        height: 56px;
    }
    .__ag__team_mini_item__ {
        width: 27px;
        height: 27px;
    }
    .__ag__assembly-char__ {
		width: 35px;
		height: 35px;
		border-radius: 50wx;
		text-align: left;
        color: #fff;
		font-size: 12wx;
        line-height: 35px;
        align-items: center;
        justify-content: center;
        font-style: italic;
        font-weight: 600;
        padding-left: 3px;
	}
    .__ag__team_medium_assembly__ {
        width: 56px;
        height: 56px;
        line-height: 56px;
        text-align: left;
        font-size: 18wx;
        padding-left: 7px;
    }
    .__ag__team_mini_assembly__ {
        width: 27px;
        height: 27px;
        line-height: 27px;
        font-size: 10wx;
        text-align: left;
        padding-left: 2px;
    }
    .__ag__assembly_a__ {
        background-image: linear-gradient(to bottom,rgb(203, 61, 69), rgb(186, 0, 0));
    }
    .__ag__assembly_b__ {
        background-image: linear-gradient(to bottom,rgb(74, 136, 224), rgb(38, 87, 166));
    }
</style>