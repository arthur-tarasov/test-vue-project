<template>
    <div>
        <el-col :span="5"  v-for="(item, index) in campaigns" :key="item.id" :offset="index % 4 > 0 ? 1 : 0">
            <el-card :body-style="{ padding: '0px'}" class="card_margin">
                <div class="top_stripe" :class="determineColorStripe(item.type)"></div>

                <div class="card_header">
                    <h3>{{ item.name }}</h3>
                    <span class="campaign_type">{{ item.type }}</span>
                </div>

                <div style="padding: 5px;">
                    <el-row :gutter="1">
                        <el-col :span="12">
                            <div>
                                <span class="card_body_label">{{ 'approved posts' | capitalize }}</span>
                                <h3>{{ item.approved_posts }}</h3>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div>
                                <span class="card_body_label">{{ 'influencers' | capitalize }}</span>
                                <h3>{{ item.num_of_artists }}</h3>
                            </div>
                        </el-col>

                    </el-row>
                    <el-row :gutter="9">
                        <el-col :span="12">
                            <div>
                                <span class="card_body_label">{{ 'likes' | capitalize }}</span>
                                <h3>{{ item.approved_likes }}</h3>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div>
                                <span class="card_body_label">{{ 'comments' | capitalize }}</span>
                                <h3>{{ item.approved_comments }}</h3>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="bottom_stripe"></div>
                <div style="padding: 5px 10px 5px 10px;">
                    <el-button @click="hideItem(item.id)">Hide</el-button>
                    <router-link :to="/dashboard/+item.id" tag="el-button">Show details</router-link>
                </div>

            </el-card>


        </el-col>
        <el-col :span="5" :push="1" v-if="countCampaigns > 0">
                <el-alert
                        title=""
                        type="info"
                        center
                        :closable="false"
                        style="margin-top: 2.6em; padding: 6em"
                        >
                    <div slot="title" class="more_title" @click="onMore">
                        <h1 class="more_title_number">
                            <span v-if="countCampaigns / 8 > 1">
                                8
                            </span>
                            <span v-else>
                                {{ Math.ceil(countCampaigns % 8) }}
                            </span>
                        </h1>
                        <span>MORE TO SHOW</span>

                    </div>
                </el-alert>

        </el-col>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            campaigns: [],
            info: 'qwerty',
            stepMore: 8,
            currentSkip: 7,
            moreCampaigns: [],
            countCampaigns: 0
        }
    },
    async created() {

        this.countCampaigns = await this.countAllCampaigns();
        this.campaigns = await this.getCampaigns();
    },
    filters: {
        capitalize: function (value) {
            if (!value) return '';
            value = value.toString();
            return value.toUpperCase()
        }
    },
    methods: {
        getCampaigns: async function(skip = 0) {
            const res = await axios.get('/api/campaigns/' + skip);
            return res.data;
        },
        countAllCampaigns: async function() {
            const res = await axios.get('/api/campaign-count');
            return res.data.count;
        },
        hideItem(id) {
            this.campaigns.splice(this.campaigns.findIndex(campaign => campaign.id === id), 1);
        },
        async onMore() {
            let moreCampaigns = await this.getCampaigns(this.currentSkip);
            this.countCampaigns -= this.stepMore;
            moreCampaigns.forEach(item => {
                this.campaigns.push(item);
            });
            this.currentSkip += this.stepMore;

        },
        determineColorStripe(type) {
            let colorStyle ="";
            switch (type) {
                case "Challenge": {
                    colorStyle = "top_stripe_violet";
                    break;
                }
                case "Influencer campaign": {
                    colorStyle = "top_stripe_blue";
                    break;
                }
                case "Giveaway": {
                    colorStyle = "top_stripe_dodgerblue";
                    break;
                }
                default: {
                    colorStyle = "top_stripe_default";
                    break;
                }
            }
            return colorStyle;
        }
    }
}
</script>

<style lang="scss" >

    .el-col-offset-1 {
        margin-left: 1.16667%;
    }
    .campaign_type {
        color: grey;
        font-size: 1em;
    }
    .card_header {
        text-align: left;
        padding: 0 0 10px 5px;
        line-height: 10px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
    }
    .el-col {
        vertical-align: middle;
        align-items: center;
        justify-content: center;
    }
    .card_body_label {
        font-size: 0.8em;
        color: grey;
    }
    .bottom_stripe {
        width: 100%;
        height: 3px;
       // background-color: darkviolet;
        background-color: darkgreen;
    }
    .card_margin {
        margin-bottom: 10px;
    }
    .top_stripe {
        position: relative;
        top: 0;
        width: 100%;
        height: 3px;
        //background-color: darkviolet;
    }
    .top_stripe_violet {
        background-color: darkviolet;
    }
    .top_stripe_blue {
        background-color: mediumblue;
    }
    .top_stripe_dodgerblue {
        background-color: dodgerblue;
    }
    .top_stripe_default {
        background-color: black;
    }

    .more_title {
        display: inline-block;
    }
    .more_title:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .more_title_number {
        font-size: 2em;
    }
    .button {
        padding: 0;
        float: right;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

</style>