<template>
    <div>

        <el-card>
            <h1 class="detail_header">{{ campaign.name }}</h1>
        </el-card>

        <el-card>
            <el-radio-group v-model="social" @change="socialChange">
                <el-radio-button label="Instagram"></el-radio-button>
                <el-radio-button label="Youtube"></el-radio-button>
                <el-radio-button label="Facebook"></el-radio-button>
                <el-radio-button label="Twitter"></el-radio-button>
            </el-radio-group>

            <el-tabs v-model="activeTab" @tab-click="tabsClick" class="status_tabs">
                <el-tab-pane label="Pending" name="pending">

                </el-tab-pane>
                <el-tab-pane label="Approved" name="approved">

                </el-tab-pane>
                <el-tab-pane label="Rejected" name="rejected">

                </el-tab-pane>
            </el-tabs>

            <el-row :gutter="20" style="padding-bottom: 2rem" v-if="activeTab === 'pending'">
                <el-col :span="15">
                    <div class="chips" v-for="(chip, index) in chips"  @click = "onChipClose(index)">
                        <el-alert
                                title=""
                                type="info"
                                style="padding-right: 1.7em"
                                :closable="false"
                               >
                            <div slot="title">
                                <span>{{ chip.title }} <i class="el-icon-close"></i> </span>
                            </div>
                        </el-alert>
                    </div>

                </el-col>

                <el-col :span="6" :offset="10" style="position: absolute; top:0;right: 6rem">
                    <el-input v-model="filterInput" placeholder="Filter by"></el-input>
                </el-col>
                <el-col :span="1" :offset="2" style="position: absolute; top:0; right: 3rem">
                    <el-button type="primary" @click="addFilter">Filter</el-button>
                </el-col>
            </el-row>

        </el-card>



        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="totalMedia">
        </el-pagination>



            <el-col :span="5"  v-for="(item, index) in searchedMedia" :key="item.id" :offset="1" >
                <el-card :body-style="{ padding: '0px'}" class="card_margin">


                    <div class="card_header">
                        <el-row >
                            <el-col :span="3"><img :src="item.author_pic" :alt="item.author_username" class="avatar"></el-col>
                            <el-col :span="1">
                                <el-row>@{{ item.author_username }}</el-row>
                                <el-row><a :href="item.link">{{ item.social_network }}</a></el-row>
                            </el-col>
                        </el-row>
                    </div>

                    <div class="hvrbox">
                        <img :src="item.pic" :alt="item.author_username" class="hvrbox-layer_bottom">
                        <div class="hvrbox-layer_top">
                            <div class="hvrbox-text">{{ item.caption }}</div>
                        </div>
                    </div>

                    <div style="padding: 5px;">
                        <el-row :gutter="1">
                            <el-col :span="12">
                                <div>
                                    <span class="card_body_label">{{ 'likes' | capitalize }}</span>
                                    <h3>{{ item.likes_number }}</h3>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div>
                                    <span class="card_body_label">{{ 'comments' | capitalize }}</span>
                                    <h3>{{ item.comments_number }}</h3>
                                </div>
                            </el-col>

                        </el-row>
                    </div>

                    <div style="border-top: 1px solid #ebeef5;box-sizing: border-box; padding: 5px 10px 5px 10px;">
                        <el-button v-if="item.status === 'pending' || item.status === 'approved'" @click="setStatus(item.id, 'rejected')">Reject</el-button>
                        <el-button v-if="item.status === 'pending' || item.status === 'rejected'" @click="setStatus(item.id, 'approved')">Approve</el-button>
                    </div>

                </el-card>
            </el-col>

    </div>
</template>

<script>
    const toLower = text => {
        return text.toString().toLowerCase()
    };

    const searchByFilter = (items, chips) => {
        if (chips) {
            return items.filter(item => {
                let accept = 0;
                for (var i = 0; i < chips.length; i++) {
                    if (toLower(item.caption).includes(toLower(chips[i].title))) {
                        accept++;
                        if (accept === chips.length) {
                            return item;
                        }
                    }
                }
            })
        }
    };

    export default {
        name: "Details",
        data() {
            return {
                campaign: {},
                social: 'Instagram',
                activeTab: 'pending',
                media: [],
                searchedMedia: [],
                filterInput: '',
                chips: [],
                currentPage: 1,
                pageSize: 8,
                totalMedia: 0,
                step: 0
            }
        },
        async created() {
            this.campaign = await this.getCampaign();
            this.media = await this.getMedia();
            this.media.map(item => {
                item.status = 'pending'
            });
            this.totalMedia = this.media.length;
            this.searchedMedia = this.media.slice(0, 8);

        },
        filters: {
            capitalize: function (value) {
                if (!value) return '';
                value = value.toString();
                return value.toUpperCase()
            }
        },
        methods: {
            getCampaign: async function () {
                const res = await axios.get('/api/campaign/' + this.$route.params.id);
                return res.data;
            },
            getMedia: async function () {
                const res = await axios.get('/api/media', {
                    params: {
                        social: this.social
                    }
                });
                return res.data;
            },
            async socialChange() {
                this.media = await this.getMedia();
                this.activeTab = 'pending';
                this.totalMedia = this.media.length;
                this.media.map(item => {
                    item.status = 'pending'
                });
                this.searchedMedia = this.media.slice(0, 8);
            },
            tabsClick() {

                let searchedMedia = this.media.filter((item, index) => {
                    if (item.status === this.activeTab) {
                        return item;
                    }
                });

                this.totalMedia = searchedMedia.length;

                this.searchedMedia = searchedMedia.slice(0, 8);
                this.currentPage = 1;
            },
            addFilter() {
                if (this.filterInput === "") return;

                this.chips.push({
                    title: this.filterInput
                });
                this.currentPage = 1;
                this.filterInput = "";
                let searchedMedia = searchByFilter(this.media, this.chips);
                this.totalMedia = searchedMedia.length;
                this.searchedMedia = searchedMedia.slice(0, 8);
            },
            onChipClose(index) {
                this.chips.splice(index, 1);

                if (this.chips.length === 0) {
                    this.searchedMedia = this.media.slice(0, 8);
                    this.totalMedia = this.media.length;
                    this.currentPage = 1;
                } else {
                    let searchedMedia = searchByFilter(this.media, this.chips);
                    this.totalMedia = searchedMedia.length;
                    this.searchedMedia = searchedMedia.slice(0, 8);
                }

            },
            handleCurrentChange(page) {
                let searched = this.media.filter((item, index) => {
                    if (item.status === this.activeTab) {
                        return item;
                    }
                })

                this.searchedMedia = searched.slice((page - 1) * this.pageSize, (page - 1) * this.pageSize + this.pageSize)
            },
            setStatus(id, status) {
                if (this.totalMedia % this.pageSize === 1 && this.currentPage === Math.ceil(this.totalMedia / this.pageSize)) {
                    this.step = this.currentPage - 2;
                } else {
                    this.step = this.currentPage - 1;
                }

                let index = this.searchedMedia.findIndex(item => item.id === id);

                this.searchedMedia[index].status = status;
                let searched = this.media.filter((item, index) => {

                    if (item.status === this.activeTab) {
                        return item;
                    }

                });

                this.searchedMedia = searched.slice(this.step * this.pageSize, this.step * this.pageSize + this.pageSize);
                this.totalMedia -= 1;

            }
        }
    }
</script>

<style>
    .detail_header {
        text-align: left;
    }
    .el-card {
        text-align: left;
    }
    .status_tabs {
        margin-top: 1rem;
    }
    .card_margin {
        margin-top: 2rem;
    }
    .el-row {
        margin-top: 0.4rem;
    }

    .chips {
        display: inline-block;
        margin-right: 1em;
    }
    .chips:hover .el-alert {
        cursor: pointer;
        background-color: #bbc1c6;
    }
    .el-pagination {
        margin-top: 1rem;
    }
    .hvrbox,
    .hvrbox * {
        box-sizing: border-box;
    }
    .hvrbox {
        position: relative;
        display: inline-block;
        overflow: hidden;
        max-width: 100%;
        height: auto;
    }
    .hvrbox img {
        max-width: 100%;
    }
    .hvrbox .hvrbox-layer_bottom {
        display: block;
    }
    .hvrbox .hvrbox-layer_top {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        padding: 15px;
        -moz-transition: all 0.4s ease-in-out 0s;
        -webkit-transition: all 0.4s ease-in-out 0s;
        -ms-transition: all 0.4s ease-in-out 0s;
        transition: all 0.4s ease-in-out 0s;
    }
    .hvrbox:hover .hvrbox-layer_top,
    .hvrbox.active .hvrbox-layer_top {
        opacity: 1;
    }
    .hvrbox .hvrbox-text {
        text-align: left;
        font-size: 12px;
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        -moz-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .hvrbox .hvrbox-text_mobile {
        font-size: 15px;
        border-top: 1px solid rgb(179, 179, 179);
        border-top: 1px solid rgba(179, 179, 179, 0.7);
        margin-top: 5px;
        padding-top: 2px;
        display: none;
    }
    .hvrbox.active .hvrbox-text_mobile {
        display: block;
    }

    .avatar {
        width: 90%;
        border-radius: 50%;
    }

</style>