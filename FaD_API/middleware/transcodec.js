/*global exports:true , module:true*/
/*jslint sub:true , newcap:true */
var ffmpeg = require('fluent-ffmpeg')
    ,mailer = require('../services').getService('Email')
    ,fs = require('fs');    

//property names preceded without '_' should be used as connect middleware
	
function _noop(){
	console.log('transcode_noop');
}	
 var _audioTarns = {
	AU2MP3 : function (req, res, next){	    //TODO : rename this to au2amr
		if(!req.body['chunkFileName']){			
			next();
			return;
		}
                
		var proc = new ffmpeg({ source:req.body['chunkFileName']+'.au' , nolog: true })
                    ,_orig ,_tmp
                    ,_chunkFileName = req.body['chunkFileName'];
                    
                _orig =  _chunkFileName + '.amr';
                _tmp = _chunkFileName + '_tmp.amr';
		proc.withNoVideo();
		proc.withAudioCodec('libopencore_amrnb');
		proc.toFormat('amr');
		proc.withAudioFrequency(8000);
		//proc.dumpCommand();
		proc.saveToFile(_tmp,function(a,b,c){			
			if(a==''){
                                fs.rename(_tmp,_orig,function(err){
                                    if(err){
                                        next('Error');
                                        return;
                                    }
                                    _audioTarns._AU2MP3(_chunkFileName,next);			
                                    return;
                                });
                                return;
                         }
                        console.log('Error while transcoding');
			next('Error');
		});		

	},
	
	_AU2MP3 : function (_auFileNamewithoutExtn,next){			
		var proc = new ffmpeg({ source:_auFileNamewithoutExtn+ '.au' , nolog: true })
                    ,_orig ,_tmp;
                    
                _orig =  _auFileNamewithoutExtn + '.mp3';
                _tmp = _auFileNamewithoutExtn + '_tmp.mp3';
		proc.withNoVideo();	
		//proc.dumpCommand();
		proc.toFormat('mp3');
		proc.withAudioCodec('libmp3lame');
		proc.withAudioFrequency(22050);
		proc.withAudioChannels(2);
		proc.withAudioBitrate('44k');
		proc.saveToFile(_tmp,function(a,b,c){			
			if(a==''){
                                fs.rename(_tmp,_orig,function(err){
                                    var _dummy;
                                    _dummy = (next)?(err?next(err):next()):'';
                                    /*
                                    if(err){
                                        if(next){
                                            next('Error');                                         
                                        }
                                        return;
                                    }                                    
                                    if(next){
					next();					
                                    }
                                    */                                    
                                });
                                return;				
			}
                        console.log('Error while transcoding');
                        if(next){
                            next('Error'); // TODO: send back the error
                        }
		});
                
            },
        
        _AU2AMR : function (_auFileNamewithoutExtn){			
		var proc = new ffmpeg({ source:_auFileNamewithoutExtn+ '.au' , nolog: true }),_start;

		proc.withNoVideo();								
		proc.withAudioCodec('libopencore_amrnb');
		proc.toFormat('amr');
		proc.withAudioFrequency(8000);
		//proc.dumpCommand();
                _start = new Date();
                try{
                    proc.saveToFile( _auFileNamewithoutExtn + '.amr',function(a,b,c){			
                            if(a==''){
                                    _noop();
                            }                
                    });
                }
                catch(e){
                    console.log('error while transcoding ' + e);
                }
	}
	
};

module.exports = _audioTarns;