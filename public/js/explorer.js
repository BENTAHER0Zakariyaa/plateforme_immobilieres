// Selector
$('#IdSelectCityInput, #IdHiddenButton').on('click',()=>{
    $('#IdHiddenButton').toggleClass('hidden');
    $('#IdSelectCityContainer').slideToggle();
});

$('body').on('click','.select-option',(e)=>{
    e.preventDefault();
    $('#IdSelectCityInput').val(e.target.innerHTML);
    $('#IdHiddenButton').toggleClass('hidden');
    $('#IdSelectCityContainer').slideToggle();
    return false;
});

// Cites

$('#IdSelectCityContainer').ready(()=>{
    $.getJSON("data/cities.json", (json)=>{
        json.map(city =>{
            $('#IdSelectCityContainer').append(`<a href="" class="select-option block px-4 py-1 transition duration-500 hover:bg-black hover:text-white">${city.name}</a>`);
        })
    });
});

$('#IdSelectCityInput').keyup((e)=>{
    text = $('#IdSelectCityInput').val();

    if(text){
        $.getJSON("data/cities.json", (json)=>{
            $('#IdSelectCityContainer').fadeIn();

            let dataFilter = json.filter (city => city.name.toLowerCase().indexOf(text.toLowerCase()) == 0);
            if (dataFilter) {
                $('.select-option').remove();
            }
            dataFilter.map(city =>{
                $('#IdSelectCityContainer').append(`<a href="" class="select-option block px-4 py-1 transition duration-500 hover:bg-black hover:text-white">${city.name}</a>`);
            })
        });
    }else{
        $('.select-option').remove();
        $.getJSON("data/cities.json", (json)=>{
            json.map(city =>{
                $('#IdSelectCityContainer').append(`<a href="" class="select-option block px-4 py-1 transition duration-500 hover:bg-black hover:text-white">${city.name}</a>`);
            })
        });
    }
});

// Filter
$('#IdShowFilter').click(function (e) {
    e.preventDefault();
    $('#IdFilter').slideToggle();

});

$('#IdNavbarButton').on('click',()=>$('#IdNavbar').slideToggle());

