
let hw_admin = ((hw)=>{
    if(!hw){
        console.error("hw.js has to be declared before hw_admin.js")
        return;  
    } 
    let obj = {};


    obj.initTypeaheads = ()=>{
        if($("#id-email"))
            $("#id-email").typeahead({
                hint:true,
                highlight:true,
                minLength:1
            },{
                displayKey:'email',
                async:true,
                source: hw.debounce((query, a,b)=>{
                    hw.ajax_req({
                        identify_hacker:true,
                        query:query
                    }, (data)=>{
                        let pd = JSON.parse(data)
                        let filtered = pd.map(x => x.fields)
                        console.log(filtered)
                        b(filtered)
                    })
                }, 500),
                templates:{
                    suggestion:function(data){
                        return "<div>"+ data.name + " ("+data.email+")</div>"
                    }
                }
            });
    }
    //-Updates the content
    //-Shows a toast if there's a message
    obj.processResponse = (data)=>{
        if(data.msg) 
            hw.toast(data.msg)
        
        if(data.content){
            $('#hw-container').fadeTo(200, 0, ()=>{
                $('#hw-container').html(data.content)
                obj.initListeners()
                obj.initTypeaheads()
                $('#hw-container').fadeTo(200, 1)
            })
        }
    }


    obj.initListeners = ()=>{
        $(".hw-back").on("click", ()=>{
            hw.ajax_req({
                'back': true
            }, obj.processResponse)
        })
        $("#hw-user-send").on("click", ()=>{
            hw.ajax_req({
                'get_lists': true,
                'email': $("#id-email").val()
            }, obj.processResponse)
        })
        $("#hw-user-send-noreq").on("click", (ev)=>{
            hw.ajax_req({
                'get_user_noreq': true,
                'email': $("#id-email").val(),
                'item_id': ev.currentTarget.dataset.itemId
            }, obj.processResponse)
        })
        $("#hw-requests-list li").on("click", (ev)=>{
            hw.ajax_req({
                'select_request': true,
                'request_id': ev.currentTarget.dataset.requestId
            }, obj.processResponse)
        })
        $("#hw-lendings-list li").on("click", (ev)=>{
            hw.ajax_req({
                'return_item': true,
                'lending_id': ev.currentTarget.dataset.lendingId
            }, obj.processResponse)
        })
        $("#hw-available-items-list li").on("click", (ev)=>{
            hw.ajax_req({
                'make_lending': true,
                'item_id': ev.currentTarget.dataset.itemId,
                'request_id': ev.currentTarget.parentNode.dataset.requestId
            }, obj.processResponse)
        })
        /* Admin no request hardware type element */
        $("#hw-type-noreq li").on("click", (ev)=>{
            hw.ajax_req({
                'select_type_noreq': true,
                'type_id': ev.currentTarget.dataset.typeId
            }, obj.processResponse)
        })
        $("#hw-available-items-list-noreq li").on("click", (ev)=>{
            hw.ajax_req({
                'select_item_noreq': true,
                'item_id': ev.currentTarget.dataset.itemId
            }, obj.processResponse)
        })
    }
   

    
    return obj
})(hw)

document.addEventListener("DOMContentLoaded", ()=>{
    hw_admin.initListeners()
    hw_admin.initTypeaheads()
})