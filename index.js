var apChoosen = [];
var idApChoosen;
var map;
var markers= [];
var iMarkers= 0;
var collections = {};
var currentTab = "who";
var usr;
var usrs= [];
var usrs2 = ["cris","adri","fer"];
var usrsAp = {};
var indexAp;
var load = false;
var first= true;

$(document).ready(function() {
  $("#forms").hide();
	$("#but2").hide();
	$("#container").hide();


     $("#but3").on("click", function() {
            changeTab(currentTab,$("#home").attr("id"));
            $('#forgit').hide();
            $('#forgit2').show();


  });
   $("#btn5").click(function(){
        save_data();
  });

  $("#but4").on("click", function() {
          changeTab(currentTab,$("#home").attr("id"));

          $('#forgit2').hide();
          $('#forgit').show();

  });
  $("#btn6").click(function(){
       load_data();

 });

  function save_data(){
    var token = $("#tok").val();
    var user = $("#usr").val();
    var repo = $("#repo").val();
    var file = $("#fich").val();
    github = new Github({
      token: token,
      auth: "oauth"
    });
    var data = {
  		collections: collections,
  		users: usrsAp
  	}
    content = JSON.stringify(data);
    myrepo = github.getRepo(user, repo);
    myrepo.write('master', file, content, "Updating data",
      function(err) {
    console.log(err);
    });

  }

    function load_data(){
  var token = $("#tok1").val();
  var user = $("#usr1").val();
  var repo = $("#repo1").val();
  var file = $("#fich1").val();
  github = new Github({
    token: token,
    auth: "oauth"
  })
    myrepo = github.getRepo(user, repo);
    myrepo.read('master', file,
    function(err, data) {
      console.log(data);
        data = JSON.parse(data);
        $.each(data.collections, function(key,value) {

        collections[key] = value;
      });
      $.each(data.users, function(key, value){


        usrsAp[key] = value;
      });
      var code =`  <dl class="curved" id= "info9">
          <dt>Lista de colecciones extraidas</dt>
          <dd> <br />
            <ul id="navlist9">

            </ul>
            <p class="last"></p>
          </dd>
        </dl>

        <dl class="curved" id= "info10" >
          <dt>Lista de aparcamientos elegidos por Usuarios de Google+</dt>
          <dd>
            <ul id="navlist10">

            </ul>
            <p class="last"></p>
          </dd>

        </dl>`;


        $("#content_right").append(code);
        $.each(collections, function(key,value) {
          var code1 = "<li>"  + key + "</li>";
          var code2 = "<ul>";
          for(var j = 0; j<value.length;j++){
                code2 += "<li>ID aparcamiento: " + value[j] + "</li>"

          }
          code2 += "</ul>";
          var code3 = code1;
          code3 += code2;
          $("#navlist9").append(code3);
        });
        $.each(usrsAp, function(key,value) {
          var code1 = "<li>ID aparcamiento: "  + key + "</li>";
          var code2 = "<ul>";
          for(var j = 0; j<value.length;j++){
                code2 += "<li>" + value[j] + "</li>"

          }
          code2 += "</ul>";
          var code3 = code1;
          code3 += code2;
          $("#navlist10").append(code3);
        });
});



}

	$("#but").click(function(){

        $("#but").remove();
    		$("#container").show();
    		alert("Ahora me puedes utilizar!");
        $("#info5").hide();
        $("#adicional").hide();
        $("#menu").css({"opacity":'1', "pointer-events": 'all',});
        $.getJSON("datos.json")
        .done(function(data){
          $("#content_left").hide();
			    loadMap();
			    apList(data);




      $("#prod").click(function(){
         var code= [];
		     changeTab(currentTab,$("#prod").attr("id"));
         });
         $("#collect").submit(function(e){
           var value;
           e.preventDefault()
           var code=[];
           value = $("#name").val();

		       var flag2 = nameIsRepetead(value);
		       if (flag2==false){
               collections[value] = [];
               code += "<li id='"+value+"'>" + value + "</li>"
               $("#navlist2").append(code);
               $("#nameC").html(value);
               $("#drop ul#navlist3").html("");
    		   }else{
		           alert("Ya existe una lista con este nombre. Utilice otro nombre");
		       }
           $("#navlist2 li[id="+value+"]").click(function(){
               var array = [];
               $("#nameC").html(value);
               array = collections[value];
                var code = [];
           	 	 var code2 = []
           	 	 for(var i = 0; i < array.length; i ++){
           	 	  code = [];
           	 		var title = data['@graph'][array[i]]['title'];
           	 		var site = data['@graph'][array[i]]['address']['locality'];
           	 		var postalCode = data['@graph'][array[i]]['address']['postal-code'];
           	 		var address = data['@graph'][array[i]]['address']['street-address'];
           	 		code += address + ", " + site + " (" + postalCode + ")";
           	 		code2 += "<li class='elem' id='"+ array[i] +"'<h4>"  + title + "</h4>";
           	 		code2 += "<ul><li>" + code + "</li></ul>"
           	 	 }

           	 	$("#drop ul#navlist3").html(code2);
              $("#drop").html();

           });

         });

         $("#who").click(function(){
		    changeTab(currentTab,$("#who").attr("id"));
           $("#drop ul#navlist3 li.elem").click(function(){

                idApChoosen = apChoosen[$(this).attr('id')];
        			 indexAp = $(this).attr('id');

             var lat = idApChoosen.location.latitude;
             var longi = idApChoosen.location.longitude;
             showAp(idApChoosen,lat,longi);
             var marker = L.marker([lat, longi]).addTo(map);
             marker.bindPopup("<b>"+idApChoosen['title']+"</b>"+ "<p><button id ='"+iMarkers+"' class='btn btn-danger mark'><i class='fa fa-trash'></i></button></p>").openPopup();
             markers.push(marker);
            iMarkers ++;

             marker.on('click',function(){
               console.log(this.id);
             });
           });
         });

        $("#serv").click(function(){
		        changeTab(currentTab,$("#serv").attr("id"));
                var code = [];
                if(usrsAp[indexAp]!=undefined){

                  for(var i = 0; i < usrsAp[indexAp].length; i ++){
                   code += "<li class='elem' id='"+usrsAp[indexAp][i] +"'>"  + usrsAp[indexAp][i] + "</li>";
                  }
                 $("#drop2 ul#navlist4").html(code);
                }
		});

	    })
        .fail(function(jqhr,status,error){
            console.log(status +":"+ error);
        })
	});
  $("#but2").click(function(){
    google();

  });

	function loadMap(){

		map = L.map('mapid').setView([40.4167, -3.70325],11);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

		}).addTo(map);
		    map.on('popupopen',onPopupopen);

		function onPopupopen(){

			  $(".mark").click(function(){
					  var mDelete = $(".mark").attr("id");
		        map.removeLayer(markers[mDelete]);
						delete markers[mDelete];
				})
		}
	}

	function apList(data){
	    apChoosen = data['@graph'];
		var code = [];
		var code2 = []
		for(index = 0; index < data['@graph'].length; index ++){
		    code = [];
			var title = data['@graph'][index]['title'];
			var site = data['@graph'][index]['address']['locality'];
			var postalCode = data['@graph'][index]['address']['postal-code'];
			var address = data['@graph'][index]['address']['street-address'];
			code += address + ", " + site + " (" + postalCode + ")";
			code2 += "<li class='elem' id='"+ index +"'<h4>"  + title + "</h4>";
			code2 += "<ul><li>" + code + "</li></ul>"
		}

		$("#navlist").append(code2);
        $("#navlist .elem").click(function(){
    			idApChoosen = apChoosen[this.id];
				indexAp = this.id;
    			var lat = idApChoosen.location.latitude;
    			var longi = idApChoosen.location.longitude;

				showAp(idApChoosen,lat,longi);

  		    var marker = L.marker([lat, longi]).addTo(map);

  				marker.bindPopup("<b>"+idApChoosen['title']+"</b>"+ "<p><button id ='"+iMarkers+"' class='btn btn-danger mark'><i class='fa fa-trash'></i></button></p>").openPopup();
  				markers.push(marker);

                iMarkers ++;

  				marker.on('click',function(){
  					console.log(this.id);
				});
		});
    $("#navlist .elem").draggable({
      cancel: "a.ui-icon",
      revert: "invalid",
      containment: "document",
      helper: "clone",
      cursor: "move"
    });
    $("#drop ul#navlist3").droppable({
      accept: "#navlist .elem",
      drop: function(event, ui){
         var drag = ui.draggable;
         var idC = drag[0].id;
         var clone = drag.clone();
         var nameC = $("#nameC").html();
		 var flag = apIsRepetead(idC,nameC);
		 if (flag == false){
		     collections[nameC].push(idC);

         $(this).append(clone);
		 }else{
		     alert("Este aparcamiento ya se ha incluido anteriormente.");
		 }
         $(this).click(function(){
           idApChoosen = apChoosen[idC];
           var lat = idApChoosen.location.latitude;
           var longi = idApChoosen.location.longitude;
           console.log(lat + "longitd"+ longi);
           showAp(idApChoosen,lat,longi);

           var marker = L.marker([lat, longi]).addTo(map);

           marker.bindPopup("<b>"+idApChoosen['title']+"</b>"+ "<p><button id ='"+iMarkers+"' class='btn btn-danger mark'><i class='fa fa-trash'></i></button></p>").openPopup();
           markers.push(marker);
                 iMarkers ++;

           marker.on('click',function(){
             console.log(this.id);
           });
         })

      }
    });

	};


	function showAp(idApChoosen,lat,longi){
		var url = "https:\/\/commons.wikimedia.org\/w\/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=";
			url += lat + "|" + longi;
			url += "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";
	  var firstFlag = true;
        $.getJSON(url).done(function(json){
			      var imgs = json.query.pages;
			      var k = 0;

			$.each( imgs, function( key, value) {

			    var pic = value.imageinfo[0].url;
			    k ++;
				if (firstFlag == true){
					$("#firstPic").html("<img src='" + pic + "' alt='First Slide' style= 'width:100%;height:400px'>");
				}else if (k == 2){
				    $("#third").html("<div class='item'><img src='" + pic + "' alt='Second Slide' style= 'width:100%;height:400px'></div>");
			    }else if (k == 3){
				    $("#fourth").html("<div class='item'><img src='" + pic + "' alt='Fourth Slide' style= 'width:100%;height:400px'></div>");
				}else{
				    $("#second").html("<div class='item'><img src='" + pic + "' alt='Third Slide' style= 'width:100%;height:400px'></div>")
					return false;
				}
				firstFlag = false;
			});
     	})
		.fail(function(jqhr,status,error){
            console.log(status +":"+ error);
        })
        showInfo(idApChoosen);
	}
    function showInfo(idApChoosen){
			var code = [];
			var code1 = [];
			code1 += "<h4>" + idApChoosen['title'] + "</h4>";
			code += "<p>" +idApChoosen['address']['locality'] + "</p>";
			code += "<p>" +idApChoosen['address']['postal-code']+ "</p>";
			code += "<p>" +idApChoosen['address']['street-address']+ "</p>";
			code += "<p>" +idApChoosen['organization']['organization-desc']+ "</p>";
            $("#info1").html(code1);
	        $("#info").html(code);
		};

});

	function apIsRepetead(idC,name){

    if(jQuery.inArray(idC, collections[name]) !== -1){
		    return true;
	  }else{
		    return false;
	}
	};

  function nameIsRepetead(name){

    if(collections[name] === undefined){
		    return false;
	}else{
		    return true;

	}
	};
	function idIsRepetead(id){
    if(usrsAp[id] === undefined){
		return false;
	}else{
		return true;

	}
	};

	function usIsRepetead(indexAp,name){
    if(jQuery.inArray(name, usrsAp[indexAp]) !== -1){
		    return true;
	}else{
		    return false;
	}
	};


	function changeTab(name1,name2){
	    var code1 = "#"+name1;
		var code2 = "#"+name2;
    var code3 = `     <div id="container">
      <div id="content">
        <div id = "content_left">
          <dl class="curved " >
                <dt>Usuarios de Google+</dt>
                <dd> <br />
                  <ul id="navlist6">

                  </ul>
                  <p class="last"></p>
                </dd>
        </div>`
		$(code1).removeClass("activelink");
		$(code2).addClass("activelink");
        switch(name1) {
            case "who":
				        $("#mapid").hide();
                $("#info1").hide();
                $("#info2").hide();
                $("#info3").hide();
                $("#info4").hide();
                $("#myCarousel").hide();


                break;
            case "prod":
                $("#info3").hide();
                $("#info4").hide();
    			         $("#content_left").hide();
                break;
            case "serv":
			          $("#info1").hide();
                $("#info2").hide();
                $("#info5").hide();
                $("#myCarousel").hide();
				        $("#drop2 ul#navlist4").html("");
                $("#adicional").hide();
				        $("#but2").hide();
                break;

            case "home":
              $("#forms").hide();
              $("#info9").hide();
              $("#info10").hide()
              break
            default:
                 break;
        }

		switch(name2) {
            case "who":
				$("#mapid").show();
                $("#info1").show();
                $("#info2").show();
                $("#info3").show();
                $("#info4").show();
                $("#myCarousel").show();



                break;
            case "prod":
      			    $("#content_left").show();
                $("#info3").show();
                $("#info4").show();
                break;
            case "serv":
			    $("#info1").show();
                $("#info2").show();
                console.log("NUEVO MINITAB");
                $("#info5").show();
                $("#myCarousel").show();
                $("#adicional").show();
                if(first == true){
                  $("#adicional").append(code3);
                }
                first = false;
				$("#but2").show();

                break;
                case "home":
                    $("#forms").show();
                     break;
               default:
                 break;
        }
		currentTab = name2;


	}
function google(){
  try {

			var host = "ws://localhost:12345/";
			console.log("Host:", host);

			var s = new WebSocket(host);

			s.onopen = function (e) {
				console.log("Socket opened.");
			};

			s.onclose = function (e) {
				console.log("Socket closed.");
			};

			s.onmessage = function (e) {
				console.log("Socket message:", e.data);
        var user = e.data;
        var name = getUser(user);


        var flg = userIsRepetead(name);
        if (name != undefined){
        if(flg == false){
          var code = [];
          usrs.push(name);
          code += "<li class ='elem 'id='"+name+"'>" + name + "</li>"
          $("#navlist6").append(code);
          $("#navlist6 .elem").draggable({
              cancel: "a.ui-icon", // clicking an icon won't initiate dragging
              revert: "invalid", // when not dropped, the item will revert back to its initial position
              containment: "document",
              helper: "clone",
              cursor: "move"
          });
      $("#drop2 ul#navlist4").droppable({
        accept: "#navlist6 .elem",
        drop: function(event, ui){
           var drag = ui.draggable;
           var name = drag[0].id;
           var clone = drag.clone();
           var id = $(name).html();

            var key = indexAp;
            var flag = idIsRepetead(indexAp);
            if(flag== false){
               usrsAp[key] = [];
      }

        var value =name;
        var flag = usIsRepetead(indexAp,name)
      if(flag == false){
       usrsAp[key].push(value);
       $(this).append(clone);
      }else{
              alert("Ya esta asignado este usuario de Google+ a este aparcamiento");
      }
      }
      });

        }
        }


			};

			s.onerror = function (e) {
				console.log("Socket error:", e);
			};

		} catch (ex) {
			console.log("Socket exception:", ex);
		}
}

function getUser(id){
  var apiKey = 'AIzaSyC3CipLkm-Jus_hMjMToMOFGtJ3WvfOr1c';
  gapi.client.setApiKey(apiKey);
  makeApiCall(id);
  console.log("En get:"+usr);
  return usr;
}
  // Load the API and make an API call.  Display the results on the screen.
  function makeApiCall(id) {
    console.log("Cristina");
    gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.people.get({
        'userId': id
        // For instance:
        // 'userId': '+GregorioRobles'
      });
      request.execute(function(resp) {
        console.log(resp.displayName);
        usr = resp.displayName;
      });
    });
  }

  function userIsRepetead(name){

  if(jQuery.inArray(name, usrs) !== -1){
  return true;
  }else{
  return false;
  }
};
