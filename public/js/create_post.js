const characterstic_Clone = `<div class="parent flex flex-row space-x-2">
                                    <input class="block py-1 px-2 rounded-xl border border-black w-full outline-none" type="text" name="characteristics[]" placeholder="Characteristic">
                                    <button class="remove py-1 px-2 rounded-xl transition duration-100 bg-red-600 hover:bg-red-400 text-white">Supprimer</button>
                                </div>`;

$("#IdAddCharacteristic").click((e)=>{
    e.preventDefault();
    $("#IdCharacteristicPlace").append(characterstic_Clone);
});

$("#IdUploader").change((e)=>{
    $(".IdImage").remove()
    e.preventDefault();
    srcs = [];
    for (let i = 0; i < e.target.files.length; i++) {
        let image_Clone = `<div class="h-32 rounded-xl overflow-hidden border border-black IdImage">
                                    <img src="${URL.createObjectURL(e.target.files[i])}" alt="" srcset="" class="object-cover w-full h-full">
                                </div>`;
        $("#IdImagesGrid").append(image_Clone);
    }
});
$(document).on('click','.remove',function(){
    $(this).closest('.parent').remove();
})

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