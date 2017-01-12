/**
 * Created by 2shou on 2017/1/7.
 */
var api = "http://test-webapi.ymws.jstv.com:80";
var orderapi = "http://test-orderapi.ymws.jstv.com:80";
var re = /^1[34578]\d{9}$/;


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
                $.ajax({
                    url:api+"/Common/SendSms",
                    type:"post",
                    data:{"Phone":$phone,"ActionType":"6"},
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
        $('.alert').hide()
    })
})
