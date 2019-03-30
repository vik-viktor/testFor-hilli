var oUrl = 'https://test.chillicode.ru';
var ui = {
	getUrlParameter: function (sParam) {
	    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	},
    truckLoad:function () {
    	if (window.location.pathname == '/') {
			$.ajax({
		        url: oUrl + '/trucks',
		        type: 'GET',
		        success: function(data) {
		        	var truckList = '<div class="truck-item-headers truck-row row">\
		        		<div class="truck-title col">Название</div>\
	        			<div class="truck-price col">Стоимость</div>\
	        			<div class="truck-but truck-but-edit col"></div>\
		        	</div>';
		        	var i = 0;
		            for (i in data) {
		            	var title = data[i].nameTruck || data[i].id + ' Без имени';
		            	var price = data[i].price || '0,00';
		        		truckList += '\
			        		<div class="truck-item truck-row align-items-center row">\
			        			<div class="truck-title col">' + title + '</div>\
			        			<div class="truck-price col">' + price + '</div>\
			        			<div class="truck-but truck-but-edit col">\
			        				<a href="/edit.html?edittruck=true&id=' + data[i].id + '&title=' + title + '&price=' + price + '" class="btn btn-outline-primary">\
			        					Изменить\
			        				</a>\
			        				<a href="#" class="btn btn-outline-danger remove-truck" data-id="' + data[i].id + '">\
			        					Удалить\
			        				</a>\
			        			</div>\
			        		</div>';
		            }
		            $('.truck-list').html(truckList);
		        },
		        error: function(data) {
		            alert('request error');
		            console.log(data);
		        }
		    });
    	}else{
    		if (ui.getUrlParameter('addtruck')) {
    			$('.top-panel .head h1').html('Добавить грузовик');
    		}
    		if (ui.getUrlParameter('edittruck')) {
    			$('.top-panel .head h1').html('Изменить грузовик');
    			$('.edit-form input[name="title"]').val(ui.getUrlParameter('title'));
    			$('.edit-form input[name="price"]').val(ui.getUrlParameter('price'));
    			$('.edit-form input[name="id"]').val(ui.getUrlParameter('id'));
    		}
    	}
    },
    flashAlert: function (text) {
    	$('#flash').fadeIn(300).find('.modal-body').html(text);
    	setTimeout(function(){
    		ui.flashAlertClose();
    	},2500)
    },
    flashAlertClose: function () {
    	$('#flash').fadeOut(300);
    	window.location.search = '';
    },
    mainInit: function () {
        this.truckLoad();
    }
}
$(document).ready(function(){
    ui.mainInit();
    if (ui.getUrlParameter('flash')) {
    	ui.flashAlert(ui.getUrlParameter('flash'))
    }
    $('.edit-form').on('submit', function() {
    	var formUrl;
    	var queryType;
    	var flashText;
    	var id = $('.edit-form input[name="id"]').val();
    	var name = $('.edit-form input[name="title"]').val();
    	var price = $('.edit-form input[name="price"]').val();
    	var data = JSON.stringify({'nameTruck': name,'price': price});
    	if (id != '') {
    		formUrl = oUrl+'/truck/'+id;
    		queryType = 'PATCH';
    		flashText = 'изменен';
    	}else{
    		formUrl = oUrl+'/truck/add'
    		queryType = 'POST';
    		flashText = 'добавлен';
    	}
    	$.ajax({
	        url: formUrl,
	        type: queryType,
	        dataType:'json',
	        data: data,
	        success: function(data) {
	        	console.log(data)
	        	window.location = '/?flash=Элемент был успешно ' + flashText
	        },
	        error: function(data) {
	            alert('request error');
	            console.log(data);
	        }
	    });
    	return false;
    });
    $('body').on('click', '.remove-truck', function() {
    	console.log('asdasd')
    	var id = $(this).attr('data-id');
    	var confirmation = confirm("Вы уверены, что хотите удалить элемент?");
    	if (confirmation) {
	    	$.ajax({
		        url: oUrl+'/truck/'+id,
		        type: 'DELETE',
		        dataType:'json',
		        success: function(data) {
		        	ui.flashAlert('Элемент был успешно удален')
		        	ui.truckLoad();
		        },
		        error: function(data) {
		            alert('request error');
		            console.log(data);
		        	ui.flashAlert('Возникли неполадки на сервере <br>Попробуйте позже')
		        }
		    });
    	}
    });
    $('.modal .closeModal').on('click', function() {
    	ui.flashAlertClose();
    	return false;
    })
})

