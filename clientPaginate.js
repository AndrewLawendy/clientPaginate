//Client pagination
(function ($) {
	$.fn.clientPaginate = function (options) {
		var _this = this,
			settings = $.extend({
				paginate: true,
				data : _this.data("paginationData") || [],
				htmlTemplate : _this.data('htmlTemplate')||"",
				objectTemplate:{},
				search : true,
				buttons:false,
				elementsPerPage : 20,
				validation: _this.data('validation') ||null,
				startWith :0,
				empty: "repeat",
				allData : "allData",
				callback : _this.data("callback") || function(){}
			},options);

		function compile(index) {
			if(settings.paginate){
				if(!_this.data("paginationData")){
					_this.data("validation",settings.validation);
					_this.data("htmlTemplate",settings.htmlTemplate);
					_this.data("callback",settings.callback);
					_this.data("paginationData",settings.data).append("<div class='clt-pagination-filter'><div class='buttons'></div></div><div class='clt-pagination-body'></div>\n<div class='clt-pagination-control'></div>");
					_this.find('.clt-pagination-filter').append('<input type="hidden" class="allData" name="'+settings.allData+'"/>').val(JSON.stringify(settings.data));
					if(settings.search){
						_this.find('.clt-pagination-filter').append("<label for='pagination-filter-"+index+"'>Filter your search with any keyword for labels or values</label>\n<div>\n<input id='pagination-filter-"+index+"' type='text' placeholder='Enter you search value...' />\n</div>\n");
					}
					if(settings.buttons){
						_this.find('.clt-pagination-filter .buttons').append(settings.buttons);
					}
					if(settings.validation) _this.closest("form").on('submit',formValidate);
					if(!_this.data("paginationData").length && settings.empty == "repeat" ) addNewElement();
					function filterPagination(){
						var _thisInput = $(this);
						clearTimeout(doneTyping);
						doneTyping = setTimeout(function () {
							var input = new RegExp(_thisInput.val(),"i"),
								filteredElement = _this.data("paginationData").filter(function (el) {
									return Object.values(el).some( function (value) {
										return input.test(value);
									});
								}),
								clonedSettings = settings;
							clonedSettings.data = filteredElement;
							clonedSettings.startWith = 0;
							_this.clientPaginate(clonedSettings);
						},doneTypingInterval);
					}
				}
				var doneTyping,
					doneTypingInterval = 550,
					allData = settings.data,
					pages = Math.ceil(allData.length/settings.elementsPerPage),
					startWith = settings.startWith == "last"?getLast():settings.startWith,
					page = !allData.length?0:startWith/settings.elementsPerPage +1,
					filteredData=allData.slice(startWith,startWith+settings.elementsPerPage),
					repeatedData = arrayRepeater(filteredData),
					pageInput = $('<input type="number">'),
					start = $('<button type="button" class="pagination-first" title="First Page"><i class="fa fa-step-backward" aria-hidden="true"></i></button>'),
					prev = $('<button type="button" class="pagination-back" title="Previous Page"><i class="fa fa-fast-backward" aria-hidden="true"></i></button>'),
					next = $('<button type="button" class="pagination-forward" title="Next Page"><i class="fa fa-fast-backward fa-flip-horizontal" aria-hidden="true"></i></button>'),
					last = $('<button type="button" class="pagination-last" title="Last Page"><i class="fa fa-step-backward fa-flip-horizontal" aria-hidden="true"></i></button>'),
					options = $('<select title="Number of inputs per page">\n<option>20</option>\n<option>50</option>\n<option>100</option>\n</select>');
				filteredData.forEach(function (el,index) {
					var elIndex = _this.data("paginationData").indexOf(el),
						validation = settings.validation,
						nthElement = repeatedData.childNodes[index];
					nthElement.setAttribute('repeater-index',elIndex);
					if(validation){
						validation[0].forEach(function (val) {
							$("<img class='required-invalid' src=\"images/pickers/error.png\" title=\"This field is mandatory.\">").insertAfter($(nthElement).find('[init-value="'+val+'"]'));
						})
					}
				});
				function addNewElement() {
					settings.data.push(JSON.parse(JSON.stringify(settings.objectTemplate)));
					settings.startWith = "last";
					_this.clientPaginate(settings);
				}
				function getLast() {
					return (pages-1)*settings.elementsPerPage;
				}
				function startFrom(e) {
					var newIndex = isNaN(e)?e.data.newIndex:e,
						clonedSettings = settings;
					clonedSettings.startWith = newIndex;
					if(newIndex < 0 || newIndex >= settings.data.length) return;
					_this.clientPaginate(clonedSettings);
				}
				function updatePagesPerPage(){
					var clonedSettings = settings;
					clonedSettings.elementsPerPage = Number($(this).val());
					clonedSettings.startWith = 0;
					_this.clientPaginate(clonedSettings);
				}
				function checkBtsAvailability(){
					var buttons = _this.find(".clt-pagination-control button"),
						actualPage = pageInput.val();
					if(pages <= 1){
						buttons.prop("disabled",true);
					}else if(actualPage == 1){
						buttons.filter(".pagination-first,.pagination-back").prop("disabled",true);
						buttons.filter(".pagination-forward,.pagination-last").prop("disabled",false);
					}else if(actualPage == pages){
						buttons.filter(".pagination-first,.pagination-back").prop("disabled",false);
						buttons.filter(".pagination-forward,.pagination-last").prop("disabled",true);
					}
				}
				function updateOriginal(){
					var _thisInput = $(this),
						allDataHidden = _this.find('.allData'),
						allDataJson = _this.data("paginationData"),
						repeatIndex = _thisInput.closest("[repeater-index]").attr('repeater-index'),
						item = allDataJson[repeatIndex],
						newVal = _thisInput["0"].nodeName == "SELECT"? (_thisInput.find('option[value="'+_thisInput.val()+'"]').val()) : _thisInput["0"].type == "checkbox"? _thisInput.is(':checked') : _thisInput.val(),
						initField = _thisInput.attr('init-value'),
						conversionFn = _thisInput.attr('conversion-fn'),
						checkboxVal = _thisInput.attr('checkbox-val');
					if(conversionFn){
						function applyConv (item ,newVal) {
							return eval(conversionFn);
						};
						newVal = applyConv(_thisInput,newVal);
					}else if (checkboxVal){
						var options = checkboxVal.split(',');
						newVal = options[!_thisInput.is(":checked")*true];
					}
					item[initField] = newVal;
					allDataJson.splice(repeatIndex,1,item);
					allDataHidden.val(JSON.stringify(allDataJson));
					_this.data("paginationData",allDataJson);
				}
				function updateRemove(e){
					var allDataHidden = _this.find('.allData'),
						allDataJson = _this.data("paginationData"),
						repeatIndex = $(e.target).attr("repeater-index"),
						clonedSettings = settings;
					allDataJson.splice(repeatIndex,1);
					allDataHidden.val(JSON.stringify(allDataJson));
					_this.data("paginationData",allDataJson).clientPaginate(clonedSettings);
				}

				function formValidate(e){
					var validationItems = settings.validation[0],
						validationIdentifier = settings.validation[1]? settings.validation[1]+": " : '',
						errors = '',
						elementsPerPage = _this.find('.clt-pagination-control select').val() || 20,
						hiddenAllData = JSON.parse(_this.find('.allData').val());
					JSON.parse($('.allData').val()).forEach(function (entry,index) {
						if(validationItems.some(function (value) { return !entry[value].length})){
							var page = "";
							if(hiddenAllData.length>elementsPerPage) page = " at page : " + (Math.ceil((index+1)/elementsPerPage) * elementsPerPage) / elementsPerPage;
							errors+="<p>"+validationIdentifier+"Missing required fields at element number : "+(index+1)+page+"</p>";
						}
					});
					if(errors.length){
						e.preventDefault();
						_this.addClass("submitted");
						$('button').has('img[src="images/common/blockingMask/loading.gif"]').removeAttr("style").find('img').remove();
						showNotification('error', errors,10000,true);
					}
				}
				pageInput.val(isFinite(page)?page:0);
				$('#pagination-filter-'+index).on('keyup',filterPagination);
				_this.find('[pagination-actions*="repeatElement"]').off('click').on('click',addNewElement);
				start.off('click').on('click',{newIndex:0},startFrom);
				prev.off('click').on('click',{newIndex:(page-1)*settings.elementsPerPage - settings.elementsPerPage},startFrom);
				next.off('click').on('click',{newIndex:(page+1)*settings.elementsPerPage - settings.elementsPerPage},startFrom);
				last.off('click').on('click',{newIndex:(pages-1)*settings.elementsPerPage},startFrom);
				options.off('change').on('change',updatePagesPerPage);
				pageInput.off('keyup').on('keyup',function (e) {
					if(e.keyCode == 13){
						var input = $(this).val();
						startFrom(input * settings.elementsPerPage - settings.elementsPerPage)
					}
				});
				if(allData.length>20){
					_this.find(".clt-pagination-control").show().html(start.add(prev).add(pageInput).add("<span> of "+pages+"</span>").add(next).add(last).add(options).add("<p>Total: "+allData.length+"</p>")).find('option:contains('+settings.elementsPerPage+')').first().attr('selected', '');
				}else {
					_this.find(".clt-pagination-control").hide();
				}
				if(!repeatedData.hasChildNodes() && typeof settings.empty == "string" && settings.empty != "repeat") repeatedData = $('<span>'+settings.empty+'</span>')[0];
				var paginationParent = _this.addClass("clt-pagination-parent").find('.clt-pagination-body').off('DOMNodeRemoved').empty();
				paginationParent[0].appendChild(repeatedData)
				paginationParent.on('DOMNodeRemoved',updateRemove).find('[init-value]').on('keyup change',updateOriginal).keyup().change();
				settings.callback();
				checkBtsAvailability();
			}else {
				_this.empty()[0].appendChild(arrayRepeater(settings.data));
				settings.callback();
			}
			function arrayRepeater(filteredArray) {
				var fr = document.createDocumentFragment();
				filteredArray.forEach(function (el,index) {
					var template = typeof settings.htmlTemplate == "string" ? $(settings.htmlTemplate)["0"].outerHTML : settings.htmlTemplate["0"].outerHTML,
						elIndex = settings.paginate?_this.data("paginationData").indexOf(el):index,
						elTemplate = $(template.replace(/{\$index}/g, elIndex));
					for(var key in el){
						var keyedEl = elTemplate[0].firstElementChild?elTemplate.find('[init-value="'+key+'"]'):elTemplate.attr("init-value") == key?elTemplate:[];
                        if(!keyedEl.length) continue;
                        var repeatFn = keyedEl.attr("repeat-fn"),
							newVal = el[key];
						if(repeatFn){
							function applyConv (newVal) {
								return eval(repeatFn);
							};
							newVal = applyConv(newVal);
						}
						var keyedElNodeName = keyedEl["0"].nodeName;
						switch (keyedElNodeName) {
							case "INPUT":
								if(keyedEl["0"].type=="checkbox"){
									var checkboxVal = keyedEl.attr('checkbox-val');
									if(!isNaN(newVal)) newVal = Number(newVal);
									keyedEl.prop("checked", newVal)
									if(checkboxVal) keyedEl.attr("value",checkboxVal.split(',')[!newVal*true]);
								}else {
									keyedEl.val(newVal);
								}
								break;
							case "SELECT":
								keyedEl.find("option:contains('" + newVal + "')").first().attr('selected', '');
								break;
							case "OPTION":
								//opt-value
								keyedEl.text(newVal);
								var optVal = keyedEl.attr("opt-value");
								if(optVal) keyedEl.val(el[optVal]);
								break;
							default:
								keyedEl.val(newVal);
								break;
						}
					}
					if(el.invalid){
						el.invalid.split(",").forEach(function (e) {
							elTemplate.find('[init-value="'+e+'"]').addClass("invalid");
						})
					}
					fr.appendChild(elTemplate[0]);
				});
				return fr;
			}
		}
		return this.each(compile);
	}
}(jQuery));
