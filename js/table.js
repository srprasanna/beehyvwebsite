$(document).ready(function(){

    var json_obj ={ "P01":{
                        "type": "platform",
                        "name": "Python",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Python is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": ["T01", "T02", "T03"]},
                    "P02":{
                        "type": "platform",
                        "name": "J2EE",
                        "img": "http://www.zeetashop.com/images/j2ee_logo.jpg",
                        "desc_text": "Java Platform, Enterprise Edition or Java EE is Oracle's enterprise Java computing platform.",
                        "desc_img:": "http://sriharitech.com/en/image/software%20courses%20images/java_logo.gif",
                        "children": ["T04", "T05"]},
                    "P03":{
                        "type": "platform",
                        "name": "Mobile",
                        "img": "http://blog.heyo.com/wp-content/uploads/2013/02/MobileLogo_400.png",
                        "desc_text": "Mobile application development is a term used to denote the act or process by which application software is developed for handheld devices, such as personal digital assistants, enterprise digital assistants or mobile phones.",
                        "desc_img:": "http://www.sexygeekz.com/wp-content/uploads/2014/10/mobile_logo_3-blog-200.jpg",
                        "children": ["T06", "T07"]},

                    "A01":{
                        "type": "architecture",
                        "name": "Python",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Python is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": ["T01", "T02"]},

                    "T01":{
                        "type": "technology",
                        "name": "Django",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Django is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []},
                    "T02":{
                        "type": "technology",
                        "name": "Flask",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Flask is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []},
                    "T03":{
                        "type": "technology",
                        "name": "Pyramid",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Pyramid is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []},
                    "T04":{
                        "type": "technology",
                        "name": "Spring",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Spring is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []},
                    "T05":{
                        "type": "technology",
                        "name": "Hibernate",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Hibernate is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []},
                    "T06":{
                        "type": "technology",
                        "name": "Android",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "Android is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []},
                    "T07":{
                        "type": "technology",
                        "name": "iOS",
                        "img": "http://python.fossee.in/static/website/images/pylogo.png",
                        "desc_text": "iOS is a widely used general-purpose, high-level programming language.",
                        "desc_img:": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
                        "children": []}
                    };

    var id_list = Object.keys(json_obj);
    var table_data = {};
    for(var i=0;i<id_list.length;i++){
        var temp_obj = json_obj[id_list[i]];
        obj_type = temp_obj["type"];
        if(obj_type=="platform"){
            table_data[temp_obj["name"]]=[];
            var children_ids = temp_obj["children"];
            var table_row = ''
            for(var j=0;j<children_ids.length;j++){
                var temp_child = json_obj[children_ids[j]];
                if(j==0){
                    table_row += '<tr class="info"><td rowspan="'+ children_ids.length +'" class="media-middle">'+ temp_obj["name"] +'</td><td>'+ temp_child["name"] +'</td><td>'+ temp_child["desc_text"] +'</td></tr>'; 
                }
                else{
                    table_row += '<tr class="info"><td>'+ temp_child["name"] +'</td><td>'+ temp_child["desc_text"] +'</td></tr>' 
                }
            }
            $('#tech-table').append(table_row);
        }
    };



    // var theUI_copy = {
    //     nodes:{"Beehyv":{color:"red", shape:"dot", alpha:1}, 
      
    //          python:{color:CLR.branch, shape:"dot", alpha:1}, 
    //          django:{color:CLR.demo, alpha:0, link:'/halfviz'},
    //          flask:{color:CLR.demo, alpha:0, link:'/atlas'},
    //          pyramid:{color:CLR.demo, alpha:0, link:'/echolalia'},

    //          J2EE:{color:CLR.branch, shape:"dot", alpha:1}, 
    //          spring:{color:CLR.doc, alpha:0, link:'#reference'},
    //          hibernate:{color:CLR.doc, alpha:0, link:'#introduction'},

    //          mobile:{color:CLR.branch, shape:"dot", alpha:1},
    //          android:{color:CLR.code, alpha:0, link:'https://github.com/samizdatco/arbor'},
    //          iOS:{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.zip'},
    //         },
    //   edges:{
    //     "Beehyv":{
    //       python:{length:.8},
    //       J2EE:{length:.8},
    //       mobile:{length:.8}
    //     },
    //     python:{django:{},
    //            flask:{},
    //            pyramid:{}
    //     },
    //     J2EE:{spring:{},
    //           hibernate:{}
    //     },
    //     mobile:{android:{},
    //           iOS:{}
    //     }
    //   }
    // }

});