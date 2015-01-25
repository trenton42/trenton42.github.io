var tips = {};

tips['home-value'] = {'title': 'Quick Tip on Home Value %:', 'content': 'A kitchen project is a defining room in your home.  Consider beginning with 15%  as a starting point for a kitchen and 8%  for a master bath project.<br /><br />Remember that a major kitchen remodel project adds 72.1% of its value back into your home\'s value and a bathroom remodel adds 71% of its value based on a national average.* <br /><br /><small>(*Source:  2009-10 Cost vs. Value, Remodeling Magazine.)</small>'};
tips['cabinet-percent'] = {'title': 'Quick Tip on the Cabinets %:', 'content': 'Cabinets are the most visible part of a remodel project.  Consider beginning with <strong>40%</strong> as a starting point for a kitchen and <strong>30%</strong> for a master bath project for the cabinets %.'};
tips['under-over-info'] = {'title': 'Quick Tip on % Difference to 100%:', 'content': 'This cell tells you the % left to get your personalized investment breakdown to 100% and EQUAL to your remodeling budget dollars in #2 above. <br /><span class="label label-important">RED</span> indicates you are above your budget dollars by going over 100%, <span class="label label-success">GREEN</span> indicates you are below your budget dollars by being under 100%, and 0% means you are at 100%.'};

function cleanNum(num) {
	if(typeof num == 'number') return num;
	num = num.replace(/[^0-9.]+/g, '');
	num = num.split('.');
	if(num.length > 2) {
		num = num.splice(0, num.length-1).join('') + '.' + num[0];
	}else{
		num = num.join('.');
	}

	num = Number(num);
	return num;
}

function formatNum(num, places, type) {
	if(typeof type == 'undefined') type = '$';
	if(typeof places != 'number') places = 0;
	if(places < 0) places = 0;
	num = Math.round(cleanNum(num)*100)/100;
	num = num.toString();
	num = num.split('.');
	var big = num[0];
	num[0] = '';
	var j = 0;
	for (var i = big.length - 1; i >= 0; i--) {
		var c = '';
		if(j%3 == 0 && j != 0) c = ',';
		num[0] = big[i] + c + num[0];
		j++;
	};
	if(typeof num[1] == 'undefined') num[1] = '00';
	if(num[1].length < places) {
	while(num[1].length < places) {
			num[1] += '0';
		}
	}else if(places == 0) {
		num.pop();
	}else if(num[1].length > places) {
		num[1] = num[1].slice(0,places);
	}
	num = num.join('.');
	if(type == '$') {
		num = '$' + num;
	}else if(type == '%') {
		num = num + '%';
	}
	return num;
}

$(function() {
	$('.format-number').change(function() {
		$(this).val(formatNum($(this).val(), 0));
	});

	$('.spinner').spinner();
	$('.percent-spinner').spinner({max: 100, min: 0, suffix: '%'});
	$('#home-value-percent,#home-value').change(calcBudgetAmount);
	calcBudgetAmount();
	$('[href=#addRow]').click(addRow);
	$('[href=#removeRow]').live('click', function() {
		var tbl = $(this).parents('table');
		$(this).parents('tr').remove();
		calcBudget(tbl);
	});
	$('.item-percent').live('change', function() {
		calcBudget($(this).parents('table'));
	});

	$('[href=#info]').each(function() {
		if(typeof tips[$(this).attr('rel')] == 'undefined') return;
		var tip = tips[$(this).attr('rel')];
		$(this).popover({trigger: 'hover', 'title': tip.title, content: tip.content});
	});
	$('[href=#info]').click(function() {
		return false;
	});

	$('[href=#toggle-example]').click(function() {
		var hidden = $('.example-budget').is(':hidden');
		if(hidden) {
			$('.example-budget').show();
			$(this).text('Hide Example Budget');
		}else{
			$('.example-budget').hide();
			$(this).text('Show Example Budget');
		}

		return false;
	});

});

function calcBudgetAmount() {
	var hv = cleanNum($('#home-value').val());
	var hp = cleanNum($('#home-value-percent').val());
	$('#budget-amount').val(formatNum(hv * (hp/100)));
	calcBudget();
}

function calcBudget(obj) {
	var ba = cleanNum($('#budget-amount').val());
	if(typeof obj == 'undefined') obj = '.budget-table';
	$(obj).each(function() {
		var totPercent = 0;
		var totAmount = 0;
		var rows = $('tbody tr',this);
		for(var i = 0; i < rows.length; i++) {
			if($('.item-percent input', $(rows).eq(i)).length) {
				var pct = $('.item-percent input', $(rows).eq(i)).val();
			}else{
				var pct = $('.item-percent', $(rows).eq(i)).text();
			}
			pct = cleanNum(pct);
			var amt = ba * (pct/100);
			totPercent += pct;
			totAmount += amt;
			$('.item-amount', $(rows).eq(i)).text(formatNum(amt));
		}
		$('tfoot .item-percent', this).text(formatNum(totPercent, 0, '%'));
		$('tfoot .item-amount', this).text(formatNum(totAmount));
	});
	calcOverages()
}

function addRow() {
	var row = $('.row-template tr').clone();
	$('.user-budget tbody').prepend($(row));
	$('.item-percent input[type=text]', row).addClass('percent-spinner').spinner({max: 100, min: 0, suffix: '%'});
	calcBudget();
	$('input[type=text]',row).eq(0).focus();
	return false;
}

function calcOverages() {
	var ba = cleanNum($('#budget-amount').val());
	var bt = cleanNum($('.user-budget th.item-amount').text());
	var pt = cleanNum($('.user-budget th.item-percent').text());
	$('.percent-over').text(Math.abs(100-pt)+'%');
	$('.dollars-over').text(formatNum(Math.abs(bt-ba)));
	if(pt > 100) {
		$('.over-under').text('over');
		$('.budget-overages .label').removeClass('label-success').addClass('label-important');
	}else{
		$('.over-under').text('under');
		$('.budget-overages .label').removeClass('label-important').addClass('label-success');
	}
}