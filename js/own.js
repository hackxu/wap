/**
 * Created by 2shou on 2017/1/7.
 */
var api = "http://test-webapi.ymws.jstv.com:80";
var orderapi = "http://test-orderapi.ymws.jstv.com:80";
var re = /^1[34578]\d{9}$/;
var addarr = [];
//判断是否登陆
// var logined = localStorage.getItem("userInfo");
if(localStorage.getItem("userInfo")){
    var logined =  JSON.parse(localStorage.getItem("userInfo"));
}

function showBg() {
    $('.bg').show();
    $('.alert').show();

}
$(function () {

    $('.nav-list p').click(function () {
        if ($(this).next(".hide-nav").is(":hidden")) {
            $(this).next(".hide-nav").show()
        } else {
            $(this).next(".hide-nav").hide()
        }

    })

    $('.get-code').click(function () {
        var $phone = $('.phone').val();
        if (!re.test($phone)) {
            $('.alert').show();
            $('.alert').find("p").text("手机号错误")
            $('.bg').show();
            return false;
        } else {
            var $getcode = $('.get-code');
            $getcode.attr("disabled", "true");
            var time = 60;
            $getcode.addClass("hui").val(time + "秒");
            if($(this).attr("data-type") == "Order"){
                //快速购买获取验证码
                $.ajax({
                    url:api+"/Common/SendSms",
                    type:"post",
                    data:{"Phone":$phone,"ActionType":"6"},
                    success:function (data) {
                        console.log(data)

                    }
                })
            }else{
                // 登陆注册获取验证码
                $.ajax({
                    url:api+"/Common/SendSms",
                    type:"post",
                    data:{"Phone":$phone,"ActionType":"5"},
                    success:function (data) {
                        console.log(data)

                    }
                })
            }


            var t = setInterval(function () {
                time = time - 1;
                var $dd = $getcode.attr("disbaled")
                // console.log($dd)
                $getcode.val(time + "秒");
                if (time < 0) {
                    clearInterval(t);
                    $getcode.val("获取验证码").removeClass("hui")
                    $getcode.removeAttr("disabled");
                }
            }, 1000)
        }
    });

    $(".alert b").click(function () {
        $(".bg").hide();
        $('.alert').hide();
        $('.loading').hide()
    })


    // 地区选择
    $('.check-address-more').click(function () {
        $('.loading').show();
        $('.all-address').attr("data-id", "0")
        $('.main').hide();
        $.ajax({
            url: api + "/Common/Addr?value=0",
            type: "get",
            success: function (data) {
//                    console.log(data)
                $('.loading').hide();
                var msg = data.Data;
                $('.all-address ul').empty();
                for (var i = 0; i < msg.length; i++) {
                    var $li = $('<li><span data-value="' + msg[i].Value + '">' + msg[i].Name + '</span><img src="images/b.png" alt=""></li>')
                    $('.all-address ul').append($li)
                }
                $(".all-address").show();
            }
        });
    });

    //获取省市区
    $(document).on("click", ".all-address ul li", function () {
//            alert("1")
        $('.loading').show()
        if ($(".all-address").attr("data-id") == 0) {
            addarr.push([$(this).find('span').text(),$(this).find("span").attr("data-value")]);

            if (addarr.length < 3) {
                $.ajax({
                    url: api + "/Common/Addr?value=" + $(this).find("span").attr("data-value"),
                    type: "get",
                    success: function (data) {
                        $('.loading').hide();
                        var msg = data.Data;
                        $('.all-address ul').empty();
                        for (var i = 0; i < msg.length; i++) {
                            var $li = $('<li><span data-value="' + msg[i].Value + '">' + msg[i].Name + '</span><img src="images/b.png" alt=""></li>')
                            $('.all-address ul').append($li)
                        }
                        $(".all-address").show();
                    }
                });
            } else if (addarr.length == 3) {
                $('.check-address-jie').attr("data-value", $(this).find("span").attr("data-value"))
                $('.Province').text(addarr[0][0]).attr("placeid",addarr[0][1])
                $('.City').text(addarr[1][0]).attr("placeid",addarr[1][1])
                $('.Area').text(addarr[2][0]).attr("placeid",addarr[2][1])
                $('.main').show();
                $('.loading').hide()
                $('.all-address').hide();
                $('.check-address-jie b').text("")
                addarr = []
            }
            /*else if (addarr.length == 4) {
             $('.check-address-jie b').text(addarr[3])
             $('.main').show();
             $('.all-address').hide()
             }*/
        }
        if ($('.all-address').attr("data-id") == 1) {
            $('.loading').hide()
            $('.check-address-jie b').text($(this).find("span").text()).attr("placeid",$(this).find("span").attr("data-value"))
            $('.main').show();
            $('.all-address').hide()
        }


    })
//            街道选择
    $('.check-address-jie').click(function () {
        $('.all-address').attr("data-id", "1")
        $.ajax({
            url: api + "/Common/Addr?value=" + $(this).attr("data-value"),
            type: "get",
            success: function (data) {
                $(".main").hide();
//                    console.log(data)
                $('.loading').hide();
                var msg = data.Data;
                $('.all-address ul').empty();
                for (var i = 0; i < msg.length; i++) {
                    var $li = $('<li><span data-value="' + msg[i].Value + '">' + msg[i].Name + '</span><img src="images/b.png" alt=""></li>')
                    $('.all-address ul').append($li)
                }
                $(".all-address").show();
            }
        })
    })

})
function floatAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}

//减
function floatSub(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    //动态控制精度长度
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
}

//乘
function floatMul(arg1,arg2)   {
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}


//除
function floatDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}

    r1=Number(arg1.toString().replace(".",""));

    r2=Number(arg2.toString().replace(".",""));
    return (r1/r2)*Math.pow(10,t2-t1);
}
