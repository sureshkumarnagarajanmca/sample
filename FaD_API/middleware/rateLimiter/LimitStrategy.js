var LimiterKeyGenerator = (function(){

    var map;

    map = {};

    function register(strategyId , fn ){
        map[strategyId] = fn;   
    }

    function getKey(strategyId , req){
        var fn;
        fn = map[strategyId];
        
        return fn(req);
    }

    return {
        register : register,
        getKey : getKey
    }

 }());


 var userStrategy ={
     key : 'userid',
     fn : function (req) {
        if (req.userContext){
            return req.userContext.userId;
        }else{
            return null;
        }
    }
 };

 var ipStrategy = {
    key : 'ip',
    fn :function (req) {
        return req.socket.remoteAddress;
    }
 };
 
 LimiterKeyGenerator.register(userStrategy.key , userStrategy.fn);
 LimiterKeyGenerator.register(ipStrategy.key , ipStrategy.fn);

module.exports = LimiterKeyGenerator;