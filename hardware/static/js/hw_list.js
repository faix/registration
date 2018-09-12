let hw_list = ((hw)=>{
    if(!hw){
        console.error("hw.js has to be declared before hw_list.js")
        return;  
    } 
    //Time interval between availability checks
    let POOLING_TIME = 5000
    //Interval id. We set it to false when it's not running
    let timer = false
    //List of item ids to check availability
    let checkItems = []
    let obj = {}
    /* private */
    function updateTimer(element, targetMs){
        let d = new Date(targetMs-Date.now())
        let count = ""
        if (d < 0)
            count = "Expired"
        else
        {
            let mins = Math.floor((d%(1000*60*60)) / (1000*60))
            let secs = Math.floor((d%(1000*60)) / 1000)
            count = mins +":"+hw.pad(secs)
        }

        element.innerHTML=count
    }
    function notifyAvailableItem(item){
        hw.notify("A "+item.name+" has become available! Click the notification to request.", 
            "HackathonAssistant", "", ()=>{
            hw.ajax_req({
                'req_item':true, 
                'item_id': item.id,
            }, (data)=>{
                if(data.ok){
                    let btn = $("[data-item-id="+item.id+"]")[0]
                    btn.dataset.targetTime = "00:"+data.minutes+":00"
                    obj.setTimer(btn)
                }
            })
        })

    }
    /* public */
    obj.setTimer=(element)=>{
        element.disabled = true
        start = Date.now()
        let str = element.dataset.targetTime.split('.')[0].split(':')
        let ds = new Date(0)
        ds.setMinutes(str[1])
        ds.setSeconds(str[2])
        let targetMs = start+ds.getTime()
        updateTimer(element, targetMs)
        setInterval(()=>{
            updateTimer(element, targetMs)
        },1000)

    }

    obj.stopPoolOf = (itemId)=>{
        checkItems.splice(checkItems.indexOf(itemId), 1)
    }

    obj.poolAvailabilityOf = (itemId)=>{
        checkItems.push(itemId)
        if(!timer){
            timer = setInterval(()=>{
                if(!checkItems)
                    timer = false
                hw.ajax_req({
                    'check_availability': true,
                    'item_ids': checkItems
                }, (data)=>{
                    for(let item of data.available_items){
                        obj.stopPoolOf(item.id)
                        notifyAvailableItem(item)
                    }
                })
            }, POOLING_TIME)
        }
    }

    obj.initListeners = ()=>{
        $("[data-action='lmk']").on("click", (ev)=>{
            if($(ev.target).hasClass('active')){
                $(ev.target).removeClass('active')
                obj.stopPoolOf(ev.target.dataset.itemId)
                return
            }
            if(!hw.canNotify){
                hw.initNotifications((permission)=>{
                    if(permission){
                        hw.notify("Notifications enabled!")
                        $(ev.target).addClass('active')
                        obj.poolAvailabilityOf(ev.target.dataset.itemId)
                    }
                })
            } else {
                $(ev.target).addClass('active')
                obj.poolAvailabilityOf(ev.target.dataset.itemId)
            }

        })
        $("[data-action='request']").on("click", (ev)=>{
            hw.ajax_req({
                'req_item':true, 
                'item_id': ev.currentTarget.dataset.itemId,
            }, (data)=>{
                if(data.ok){
                    ev.currentTarget.dataset.targetTime = "00:"+data.minutes+":00"
                    obj.setTimer(ev.currentTarget)
                }
            })
        })
        $(".hw-toggle").on("click", (ev)=>{
            $(ev.currentTarget).toggleClass("open")
            $(ev.currentTarget).siblings(".hw-toggle-actor").toggleClass("open")
        })
    }
    return obj
})(hw)

document.addEventListener("DOMContentLoaded", ()=>{
    $('[data-target-time]').each((i,elem)=>{
        hw_list.setTimer(elem)
    })
    hw_list.initListeners()
})