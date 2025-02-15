import {computed} from "vue";
import moment from "moment/moment";

export const displayHour = computed(()=>{
    const hour = moment().hour()
    if(hour >= 0 && hour < 12){
        return 'Good morning'
    } else if(hour >= 12 && hour < 15){
        return 'Good afternoon'
    } else {
        return 'Good evening'
    }
})