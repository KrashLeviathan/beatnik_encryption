/**
 * Created by adm_gcs on 11/3/2016.
 */

function get_words_api(){
    $.ajax({
        url: 'http://www.randomtext.me/api/gibberish/p-5/100',
        success: function(json){
            var p = json.text_out;
            var words = $(p).text();
            var words_array = words.split(' ');
            var words1 = [];
            var words2 = [];
            var words3 = [];
            var words4 = [];
            for(var i =0;i<100;i++){
                if(i<25){
                    words1.push(words_array[i]);
                }else if(i<50){
                    words2.push(words_array[i]);
                }else if(i<75){
                    words3.push(words_array[i]);
                }else{
                    words4.push(words_array[i]);
                }
            }
            $.getJSON('/database.php?action=add_words&words='+words1.toString(), function(php_json){
                console.log(php_json);
            });
            // $.getJSON('/database.php?action=add_words&words='+words2.toString(), function(php_json){
            //     console.log(php_json);
            // });
            // $.getJSON('/database.php?action=add_words&words='+words3.toString(), function(php_json){
            //     console.log(php_json);
            // });
            // $.getJSON('/database.php?action=add_words&words='+words4.toString(), function(php_json){
            //     console.log(php_json);
            // });

        }
    });
}