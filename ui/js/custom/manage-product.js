var productModal = $("#productModal");
    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.unit_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.unit_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    // Save Product
    $("#saveProduct").on("click", function () {
        // If we found id value in form then update product detail
        var data = $("#productForm").serializeArray();
        var requestPayload = {
            name: null,
            unit_id: null,
            price_per_unit: null
        };
        for (var i=0;i<data.length;++i) {
            var element = data[i];
            switch(element.name) {
                case 'name':
                    requestPayload.name = element.value;
                    break;
                case 'uoms':
                    requestPayload.unit_id = element.value;
                    break;
                case 'price':
                    requestPayload.price_per_unit = element.value;
                    break;
            }
        }
        callApi("POST", productSaveApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });

    // $(document).on("click", ".delete-product", function (){
    //     var tr = $(this).closest('tr');
    //     var data = {
    //         product_id : tr.data('id')
    //     };
    //     var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
    //     if (isDelete) {
    //         // callApi("POST", productDeleteApiUrl, data);
    //         callApi("POST", productDeleteApiUrl + '/' + data.product_id,{});
    //     }
    // });
    $(document).on("click", ".delete-product", function () {
        var tr = $(this).closest('tr');
        var product_id = tr.data('id');
        var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
        if (isDelete) {
            // Correctly format the URL with the product_id
            callApi("POST", productDeleteApiUrl + '/' + product_id, {});
        }
    });
    

    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, unit) {
                    options += '<option value="'+ unit.unit_id +'">'+ unit.unit_name +'</option>';
                });
                $("#unit").empty().html(options);
            }
        });
    });