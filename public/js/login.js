var api_l = '/api/accounts/login';
var app = new Vue({
    el      : '#container',
    data    : {
        telephone : ''
    },
    methods : {
        check : function() {
            qwest.post(api_l, {
                telphone : this.telephone
            }).then(function(xhr, result) {
                if(result.status == 200) {
                    window.location = '/getQuestion';
                } else {
                    alert('用户不存在');
                }
            });
        }
    }
});