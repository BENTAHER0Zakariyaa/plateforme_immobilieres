
$('#IdNavbarButton').on('click',()=>$('#IdNavbar').slideToggle(500));

$(window).on('resize',()=>{
    if($(window).width()>=755)
        $('#IdNavbar').hide()
});

$('#IdPhone').hide();
$('#IdEmail').hide();

$('#IdPhoneIcon').on('click',(e)=>{
    e.preventDefault();
    $('#IdPhone').slideToggle(500);
    return false;
})
$('#IdEmailIcon').on('click',(e)=>{
    e.preventDefault();
    $('#IdEmail').slideToggle(500);
    return false;
})