let hw_list = ((hw)=>{
    if(!hw){
        console.error("hw.js has to be declared before hw_list.js")
        return;  
    } 
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

    obj.initListeners = ()=>{
        $(".hw-req-btn").on("click", (ev)=>{
            hw.ajax_req({
                'req_item':true, 
                'item_id': ev.currentTarget.dataset.itemId,
            }, (data)=>{
                if(data.msg) hw.toast(data.msg)
                if(data.ok){
                    ev.currentTarget.dataset.targetTime = "00:"+data.minutes+":00"
                    obj.setTimer(ev.currentTarget)
                }
            })
        })
        $(".hw-toggle-desc").on("click", (ev)=>{
            $(ev.currentTarget).toggleClass("open")
            $(ev.currentTarget).siblings(".hw-description").toggleClass("open")
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