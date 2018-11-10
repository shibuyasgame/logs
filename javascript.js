
function zeroPad(n, w){
    var zeroCount = Math.max(0, w - n.toString().length);
    var zeroString = Math.pow(10, zeroCount).toString().substr(1);
    return zeroString + n;
}

function classRenamer(c){
    switch(c) {
        case "a":
            return "speaker";
        case "b":
            return "system";
        case "c":
            return "block";
        case "d":
            break;
        case "e":
            break;
        default:
            return c;
    }

}


var nav = Vue.component("navigation", {
    props: ['page', 'max'],
    data: function() {
        return {
            left: -1,
            right: -1
        }
    },
    template: '<div class="nav fixed"><a v-if="left > -1" class="left" v-bind:href="link(left)">Prev Page</a><a v-if="right > -1" class="right" v-bind:href="link(right)">Next Page</a></div>',
    mounted: function() {
        if(parseInt(this.page) > 0) {
            this.left = this.page - 1;
        }
        if(parseInt(this.page) < this.max - 1) {
            this.right = this.page + 1;
        }
    },
    methods: {
        link: function (pagenum) {
            return window.location.pathname + "?page=" + pagenum;
        }
    }
});

var logItem = Vue.component("log-item", {
    props: ['logdata', 'index'],
    data: function () {
        return {
            logtype: "",
            color: "",
            name: "",
            message: "",
            date: "",
            id: ""
        }
    },
    template: '<div :id="id" v-bind:class="logtype"><div><b v-bind:style="{color: color}">{{name}}</b><span v-html="message"></span></div><div class="timestamp">{{date}}</div></div>',
    mounted: function(){
        this.logtype = this.logdata.t;
        this.message = this.logdata.m;
        this.id = "line-" + parseInt(this.index);
        if (this.logtype != "followup") {
            this.color = "#" + this.logdata.c;
            this.name = this.logdata.n;
            this.message = this.logdata.m;
            this.date = this.logdata.d;
        }
    }
});

new Vue({
    el: '#app',
    data: {
        logs: [],
        page: 0
    },
    components: {LogItem: logItem, navigation: nav},
    created: function(){
        var self = this;
        var url = new URL(window.location.href);
        var page = url.searchParams.get("page");
        page = (page == null ? 0 : page);
        this.page = parseInt(page);
        $.get('logs/' + zeroPad(page, 5) + '.jsonl', function(json) {
            var lines = json.trim().split("\n").map(x => JSON.parse(x));
            self.logs = lines;
        });
    }
});