
import axios from 'axios'
import Noty from 'noty';
import {initAdmin} from './admin'
function valid(){
    console.log("hello")
}

function Export() {
    console.log("coming")
}

let check=document.querySelector('#check')

let alertMsg=document.querySelector('#success-alert')
if(alertMsg)
{
    setTimeout(()=>{
        alertMsg.remove()
    },1000)
}


initAdmin()
