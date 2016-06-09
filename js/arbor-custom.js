
(function($){

    var json_obj    
    var Renderer = function(elt){
    var dom = $(elt)
    var canvas = dom.get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var sys = null

    var _vignette = null
    var selected = null,
        nearest = null,
        _mouseP = null;

    
    var that = {
      init:function(pSystem){
        sys = pSystem
        sys.screen({size:{width:dom.width(), height:dom.height()},
                    padding:[36,60,36,60]})

        $(window).resize(that.resize)
        that.resize()
        that._initMouseHandling()

        sys.eachNode(function(node, pt) {
            if(node.data.image) {
                node.data.imageob = new Image()
                node.data.imageob.src = node.data.image
            }
        })

        if (document.referrer.match(/echolalia|atlas|halfviz/)){
          // if we got here by hitting the back button in one of the demos, 
          // start with the demos section pre-selected
          that.switchSection('demos')
        }
      },
      resize:function(){
        canvas.width = $('#sitemap').width()
        canvas.height = .70* $(window).height()
        sys.screen({size:{width:canvas.width, height:canvas.height}})
        _vignette = null
        that.redraw()
      },
      redraw:function(){
        gfx.clear()
        sys.eachEdge(function(edge, p1, p2){
          if (edge.source.data.alpha * edge.target.data.alpha == 0) return
          gfx.line(p1, p2, {stroke:"#b2b19d", width:2, alpha:edge.target.data.alpha})
        })
        sys.eachNode(function(node, pt){            
          var w = Math.max(20, 20+gfx.textWidth(node.name) )
          var radius = node.data.radius;
          if (node.data.alpha===0) return
          // if (node.shape=="dot"){
          //   gfx.oval(pt.x-radius/2, pt.y-radius/2, radius, radius, {fill:node.data.color, alpha:node.data.alpha})
          //   //gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:12})
          // }else{
          //   gfx.rect(pt.x-w/2, pt.y-8, w, 20, 4, {fill:node.data.color, alpha:node.data.alpha})
          //   gfx.text(node.name, pt.x, pt.y+9, {color:"white", align:"center", font:"Arial", size:12})
          // }

          //Add images in place of text
          //Reference: http://stackoverflow.com/questions/9826253/performance-issues-using-images-with-arbor-js
          var imageob = node.data.imageob
          var imageH = node.data.image_h
          var imageW = node.data.image_w

          gfx.oval(pt.x-radius/2, pt.y-radius/2, radius, radius, {fill:node.data.color, alpha:node.data.alpha})
          // Draw the object        
          if (imageob){
              // Images are drawn from cache
              ctx.drawImage(imageob, pt.x-(imageW/2), pt.y-imageH/2, imageW, imageH)
          }
        })
        that._drawVignette()
      },
      
      _drawVignette:function(){
        var w = canvas.width
        var h = canvas.height
        var r = 20

        if (!_vignette){
          var top = ctx.createLinearGradient(0,0,0,r)
          top.addColorStop(0, "#e0e0e0")
          top.addColorStop(.7, "rgba(255,255,255,0)")

          var bot = ctx.createLinearGradient(0,h-r,0,h)
          bot.addColorStop(0, "rgba(255,255,255,0)")
          bot.addColorStop(1, "white")

          _vignette = {top:top, bot:bot}
        }
        
        // top
        ctx.fillStyle = _vignette.top
        ctx.fillRect(0,0, w,r)

        // bot
        ctx.fillStyle = _vignette.bot
        ctx.fillRect(0,h-r, w,r)
      },

      switchMode:function(e){
        if (e.mode=='hidden'){
          dom.stop(true).fadeTo(e.dt,0, function(){
            if (sys) sys.stop()
            $(this).hide()
          })
        }else if (e.mode=='visible'){
          dom.stop(true).css('opacity',0).show().fadeTo(e.dt,1,function(){
            that.resize()
          })
          if (sys) sys.start()
        }
      },
      
      switchSection:function(newSection){
        var parent = sys.getEdgesFrom(newSection)[0].source
        var children = $.map(sys.getEdgesFrom(newSection), function(edge){
          return edge.target
        })
        
        sys.eachNode(function(node){
          if (node.data.shape=='dot') return // skip all but leafnodes

          var nowVisible = ($.inArray(node, children)>=0)
          var newAlpha = (nowVisible) ? 1 : 0
          var dt = (nowVisible) ? .5 : .5
          sys.tweenNode(node, dt, {alpha:newAlpha})

          if (newAlpha==1){
            node.p.x = parent.p.x + .05*Math.random() - .025
            node.p.y = parent.p.y + .05*Math.random() - .025
            node.tempMass = .001
          }
        })
      },
      
      
      _initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        selected = null;
        nearest = null;
        var dragged = null;
        var oldmass = 1

        var _section = null

        var handler = {
          moved:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = sys.nearest(_mouseP);
            var node_name = nearest.node.name;
            var id_list = Object.keys(json_obj);
            if (nearest.distance<30 && nearest.node.data.alpha==1){
                $(this).css('cursor','pointer');
                for(var i=0;i<id_list.length;i++){
                    if(json_obj[id_list[i]]["name"]==node_name){
                        var node_desc = "<img src='"+json_obj[id_list[i]]["desc_img"]+"' />"
                        node_desc += json_obj[id_list[i]]["desc_text"];
                    }
                }
                $('#node-desc').empty();
                $('#node-desc').append(node_desc);
            }
            else{
                $(this).css('cursor','auto');
            }

            if (!nearest.node) return false

            return false
          },
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = dragged = sys.nearest(_mouseP);
            _section = nearest.node.name
            that.switchSection(_section)

            // var s = arbor.Point(500,300);
            // nearest.node.p = sys.fromScreen(s);
            
            if (dragged && dragged.node !== null) dragged.node.fixed = true

            $(canvas).unbind('mousemove', handler.moved);
            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (!nearest) return
            if (dragged !== null && dragged.node !== null){
              var p = sys.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null;
            // selected = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            $(canvas).bind('mousemove', handler.moved);
            _mouseP = null
            return false
          }


        }

        $(canvas).mousedown(handler.clicked);
        $(canvas).mousemove(handler.moved);

      }
    }
    
    return that
  }
  
  
  var Nav = function(elt){
    var dom = $(elt)

    var _path = null
    
    var that = {
      init:function(){
        $(window).bind('popstate',that.navigate)
        dom.find('> a').click(that.back)
        $('.more').one('click',that.more)
        
        $('#docs dl:not(.datastructure) dt').click(that.reveal)
        that.update()
        return that
      },
      more:function(e){
        $(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn()
        $(this).next('h2').find('a').one('click', that.less)
        
        return false
      },
      less:function(e){
        var more = $(this).closest('h2').prev('a')
        $(this).closest('h2').prev('a')
        .nextAll().fadeOut(function(){
          $(more).text('creation & use').removeClass('less').attr('href','#')
        })
        $(this).closest('h2').prev('a').one('click',that.more)
        
        return false
      },
      reveal:function(e){
        $(this).next('dd').fadeToggle('fast')
        return false
      },
      back:function(){
        _path = "/"
        if (window.history && window.history.pushState){
          window.history.pushState({path:_path}, "", _path);
        }
        that.update()
        return false
      },
      navigate:function(e){
        var oldpath = _path
        if (e.type=='navigate'){
          _path = e.path
          if (window.history && window.history.pushState){
             window.history.pushState({path:_path}, "", _path);
          }else{
            that.update()
          }
        }else if (e.type=='popstate'){
          var state = e.originalEvent.state || {}
          _path = state.path || window.location.pathname.replace(/^\//,'')
        }
        if (_path != oldpath) that.update()
      },
      update:function(){
        var dt = 'fast'
        if (_path===null){
          // this is the original page load. don't animate anything just jump
          // to the proper state
          _path = window.location.pathname.replace(/^\//,'')
          dt = 0
          dom.find('p').css('opacity',0).show().fadeTo('slow',1)
        }

        switch (_path){
          case '':
          case '/':
          dom.find('p').text('a graph visualization library using web workers and jQuery')
          dom.find('> a').removeClass('active').attr('href','#')

          $('#docs').fadeTo('fast',0, function(){
            $(this).hide()
            $(that).trigger({type:'mode', mode:'visible', dt:dt})
          })
          document.title = "arbor.js"
          break
          
          case 'introduction':
          case 'reference':
          $(that).trigger({type:'mode', mode:'hidden', dt:dt})
          dom.find('> p').text(_path)
          dom.find('> a').addClass('active').attr('href','#')
          $('#docs').stop(true).css({opacity:0}).show().delay(333).fadeTo('fast',1)
                    
          $('#docs').find(">div").hide()
          $('#docs').find('#'+_path).show()
          document.title = "arbor.js Â» " + _path
          break
        }
        
      }
    }
    return that
  }
  
  $(document).ready(function(){
    $.getJSON('js/technologies.json', function(response){
        json_obj = response;
        var CLR = {
          branch:"#b2b19d",
          code:"orange",
          doc:"#922E00",
          demo:"#a7af00"
        }

        var theUI={
            "nodes":{"Beehyv":{color:"#5DAB46", shape:"dot", "alpha":1, "radius": 60, "image":"http://www.beehyv.com/images/logo.jpg", "image_w":30, "image_h":30}
            },
            "edges":{
                "Beehyv":{}
            }
        }
        

        var id_list = Object.keys(json_obj);

        for(var i=0;i<id_list.length;i++){
            var temp_obj = json_obj[id_list[i]];
            var obj_type = temp_obj["type"];
            if(obj_type=="platform"){
                var platform_name = temp_obj["name"];
                var platform_image = temp_obj["img"];
                theUI["nodes"][platform_name]={"color":"#3961AD", "shape":"dot", "alpha":1, "radius": 60, "image":platform_image, "image_w":30, "image_h":30};
                theUI["edges"]["Beehyv"][platform_name] = {};
                if(!theUI["edges"][platform_name]){
                    theUI["edges"][platform_name] = {};
                }
                var children_ids = temp_obj["children"];
                for(var j=0;j<children_ids.length;j++){
                    var temp_child = json_obj[children_ids[j]];
                    var child_image = temp_child["img"];
                    theUI["nodes"][temp_child["name"]]={"color":"#5DAB46", "alpha":0, "radius": 50, "image":platform_image, "image_w":25, "image_h":25};
                    theUI["edges"][platform_name][temp_child["name"]] = {};
                }
            }
        }


        var sys = arbor.ParticleSystem()
        sys.parameters({stiffness:900, repulsion:2000, gravity:true, dt:0.015})
        sys.renderer = Renderer("#sitemap")
        sys.graft(theUI)
        
        var nav = Nav("#nav")
        $(sys.renderer).bind('navigate', nav.navigate)
        $(nav).bind('mode', sys.renderer.switchMode)
        nav.init()

      });
    
  })
})(this.jQuery)