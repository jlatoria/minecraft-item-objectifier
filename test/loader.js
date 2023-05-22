$( document ).ready(function() {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        $('#data-container').append("<tr class='"+ item.craftable +"'><td>"+ item.id +"<td> <td><b>"+ item.displayName +"</b></td><td><b>"+ item.price +"</b></td></div>") 
    }
   
});

