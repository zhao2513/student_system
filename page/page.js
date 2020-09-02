(function() {
    function Page(options, wrap) {
        // page为当前页
        this.page = options.page || 1;
        this.num = options.num || 1;
        this.wrap = wrap || $('body');
        this.getPageIndex = options.getPageIndex || function() {};
        console.log(this)

    }
    Page.prototype.init = function() {
        this.createDOM();
        this.bindEvend();
    }
    Page.prototype.createDOM = function() {
        var self = this;

        if (this.page > this.num) {
            alert('所传数据有误');
            return false;
        }
        console.log(this.num, this.page)

        var myPage = $('<div id="my-page"></div>');


        //1. 添加上一页
        if (this.page != 1) {
            $('<div class="page page-prev">上一页</div>').appendTo(myPage);
        }

        //2. 添加第一页
        $('<div class="page num"></div>')
            .text(1)
            .appendTo(myPage)
            .addClass(this.page == 1 ? 'active-page' : '');;


        //3. 添加省略号:当到第五页时，才会出现前省略号
        if (this.page > 4) {
            $('<span class="sport">...</span>').appendTo(myPage);
        }
        //4. 把当前页的前后两页写出来
        for (var i = this.page - 2; i <= this.page + 2; i++) {
            //5. 当i大于1时和小于最后一页才写出来，因为已经手动写了
            if (i > 1 && i < this.num) {
                $('<div class="page num"></div>')
                    .text(i)
                    .appendTo(myPage)
                    .addClass(this.page == i ? 'active-page' : '');;
            }


        }

        //3. 添加后省略号:因为当前页肯定大于1，所以总页数起码要大于4才会有后省略号。
        //当最后一页反推前四也会存在，才会有后省略号。
        if (this.num - this.page > 3) {
            $('<span class="sport">...</span>').appendTo(myPage);
        }

        //2. 添加最后一页
        if (this.num > 1) {
            console.log(this.page)
            $('<div class="page num"></div>')
                .text(this.num)
                .appendTo(myPage)
                .addClass(this.page == this.num ? 'active-page' : '');;
        }

        //1. 添加下一页
        if (this.page != this.num) {
            $('<div class="page page-next">下一页</div>').appendTo(myPage);

        }

        //为当前页添加类名
        if (this.page < 1) {
            alert('请输入正确的页码');
            return false;
        }
        this.wrap.empty().append(myPage);

    }


    Page.prototype.bindEvend = function() {
        var self = this;

        $('.page-prev').click(function() {
            console.log(self.page)
            self.page--;
            self.init();
            self.getPageIndex(self.page);

        })

        $('.page-next').click(function() {
            //重新渲染，因为每次显示的页数都不一样:init
            self.page++;
            self.init();
            self.getPageIndex(self.page);

        })

        $('#my-page').on('click', '.num', function() {
            //事件委托
            self.page = $(this).text();
            self.init();
            self.getPageIndex(self.page);
        })
    }
    $.fn.extend({
        page: function(options) {
            var obj = new Page(options, this);
            console.log(this)
            obj.init();
        }
    })
})();