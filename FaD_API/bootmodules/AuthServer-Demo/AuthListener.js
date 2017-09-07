var passport = require('passport');

var ERROR_MESSAGE_MAP = {};
ERROR_MESSAGE_MAP['PASSWORD_POLICY_CHANGED'] = {
    httpStatus: '401',
    code : 46,
    msg: "PASSWORD_POLICY_CHANGED"
};
ERROR_MESSAGE_MAP['PASSWORD_EXPIRED'] = {
    httpStatus: '401',
    code : 47,
    msg: "PASSWORD_EXPIRED"
};

ERROR_MESSAGE_MAP['CATCH_ALL'] = {
    httpStatus: '500',
    code:-1000,
    msg: "INTERNAL_SERVER_ERROR"
};


AuthGenerator = (function(){


	function samlStrategy(req, res, next) {
		passport.authenticate('saml',
			function(err, redirURL){
                if(!redirURL){
                    sendErrResp(res);
				    return;
                }
        
   /*  
        var token = redirURL;
        var htmlCont ='<html> <form action='+token.split('?')[0]+' method = "post"> <input type="hidden" name = '+token.split('?')[1].split('&')[0].split('=')[0]+' value = '+token.split('?')[1].split('&')[0].split('=')[1]+'> <input type="hidden" name = '+token.split('?')[1].split('&')[1].split('=')[0]+' value = '+token.split('?')[1].split('&')[1].split('=')[1]+'></FORM> <script>document.forms[0].submit();</script></HTML>';

        res.cookie("bearerToken", token);
         res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(htmlCont);
        res.end();
    */
            res.redirect(redirURL);
            })(req, res, next);
    }

    
    
	function bearerStrategy(req, res, next) {
        var isvalid;
		passport.authenticate('bearer',
			function(err, tokenInst, info) {
				if(!tokenInst){
                    res.setHeader('WWW-Authenticate', 'Bearer realm=\"Users\", error=\"invalid_token\"');  
				    sendErrResp(res);
				  return;
				}
                isvalid = tokenInst.isTokenValid({});
                //custom minimal changes to support existing authmiddleware logic
                if(isvalid.isValid === false){
                    return sendErrResp(res , isvalid.errorCode);
                }
                req.isAuthenticated = true;
                req.tokenInfo = tokenInst;

				next();
		})(req, res, next);
    }





	function sendErrResp(res , rc){
        error = {
			msg: 'INVALID_ACCESS_TOKEN',
			code: rc || 41
		}
        if(ERROR_MESSAGE_MAP[rc]){
            error=ERROR_MESSAGE_MAP[rc];
        }
		errors =[error];
		resp = {};
		resp.errors = errors;
		res.status(401);
		res.setHeader('response-error-description' , JSON.stringify(resp));
		res.json(resp);
	}

		return{
				bearer : bearerStrategy,
                mediabasic : mediaBearerStrategy,
                saml : samlStrategy
			}
})();

function AuthListener(strategy){
	return AuthGenerator[strategy];
}
module.exports = AuthListener;
