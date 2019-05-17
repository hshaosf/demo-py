"use strict";
(function(_d, _w, _t, $){
  var demo = {
    cmn : {
      supportLocalStorage : function(){ return (_w.localStorage!=undefined); },
      setItem : function(key,value){ if(this.supportLocalStorage()){_w.localStorage.setItem(key,value);return true;}return false;},
      getItem : function(key){if(this.supportLocalStorage()){ return _w.localStorage.getItem(key);}return null;},
      setItemObj : function(key,value){return setItem(key,JSON.stringify(value));},
      getItemObj : function(key){var o = getItem(key); if(o){o=JSON.parse(o);} return o;},
      removeItem : function(key){if(this.supportLocalStorage()){return _w.localStorage.removeItem(key);}return false;},
      clearStorage : function(){ if(this.supportLocalStorage()){return _w.localStorage.clear();}return false;},
      set : function(key,value){ _t[key] = value;},
      get : function(key){return _t[key];}
    },
    ban : {
      init : function(){
        _t.demo.clearAlerts();
        _t.demo.hideEl('#SelectBanLookup');
        _t.demo.cmn.set('select_tpl', $('#SelectBanLookup .form-selection .form-check').clone());
        $('#SelectBanLookup .form-selection .form-check').remove();
        $('#ButtonBanLookup').click(_t.demo.ban.lookup);
        $('#ButtonBanChoose').click(_t.demo.ban.select);
      }, 
      lookup : function(e){
        _t.demo.ban.clearError();
        _t.demo.hideEl('#SelectBanLookup', false);
        var v = $('#InputBanLookup').val();
        if(v.length==7 && v.match(/[0-9]/g)){ 
          if(_t.demo.isSvcsEnabled()){
            $('#SelectBanLookup .form-selection').html('');
            _t.demo.ban.loading(true);
            $.get(__svcs.ban+'&id='+v, _t.demo.ban.selection);
          }
        }else{
          _t.demo.ban.error(false);
        }
      },
      selection : function(d){
        _t.demo.ban.loading(false);
        if(d.status == 'success' && Array.isArray(d.data.locations) && d.data.locations.length){
          var data = d.data.locations;
          _t.demo.cmn.set('ban_data', data); 
          for(var i=0; i<data.length; i++){
            var item = _t.demo.cmn.get('select_tpl').clone();
            var item_id = 'select-lin-'+data[i].LIN;
            var item_name = 'select-ban-'+data[i].BAN;
            var item_text = data[i].DBAName + ', ' + data[i].StreetAddress + ', ' + data[i].City + ', ' + data[i].State + ', ' + data[i].PostalCd + ' (' + data[i].LIN + ')';
            item.children('.form-check-input').attr('id', item_id).attr('name', item_name).attr('data-id', i);
            item.children('.form-check-label').text(item_text).attr('for', item_id);
            $('#SelectBanLookup .form-selection').append(item);
          }
          _t.demo.showEl('#SelectBanLookup', true);
        }else{
          if(d.status == 'error'){
            _t.demo.ban.error(true);
          }else{
            _t.demo.ban.fail();
          }
        }
      },
      select : function(){
        var i = $('#SelectBanLookup .form-selection input:checked').attr('data-id');
        var data = _t.demo.cmn.get('ban_data');
        if(i < data.length){
          var item = data[i];
          for(var p in item){
            _t.demo.setInput('input[data-field-name="'+p+'"]', item[p]);
          }
          _t.demo.hideEl('#SelectBanLookup', true);
        }
      },
      loading : function(is_loading){
        if(is_loading){
          $('#ButtonBanLookup').append('<span class="spinner-border spinner-border-sm ml-3" role="status" aria-hidden="true"></span>');
        }else{
          $("[role='status']").remove();
        }
      },
      error : function(show_alert){
        $('#InputBanLookup').addClass('is-invalid');
        $('#InputBanLookup ~ .invalid-feedback').show();
        if(show_alert){
          $('#InputBanLookup ~ .invalid-feedback').hide();
          _t.demo.showEl('#InputBanLookup ~ .alert-danger');
        }
      },
      fail : function(){
        _t.demo.showEl('#InputBanLookup ~ .alert-warning');
      },
      clearError : function(){
        $('#InputBanLookup').removeClass('is-invalid');
        _t.demo.ban.loading(false);
        _t.demo.clearAlerts();
      }
    },
    hideEl : function(el, animate){
      var duration = animate? 1000: 0;
      $(el).hide(duration, function(){ $(this).addClass('d-none') });
    },
    showEl : function(el, animate){
      var duration = animate? 1000: 0;
      $(el).hide().removeClass('d-none');
      $(el).show(duration);
    },
    clearAlerts : function(){
      $('.alert').addClass('d-none');
    },
    setInput : function(el, value){
      var is_readyonly = $(el).prop('readonly');
      if(is_readyonly){ $(el).prop('readonly', false); }
      $(el).val(value);
      if(is_readyonly){ $(el).prop('readonly', true); }
    },
    isSvcsEnabled : function(){
      return (typeof __svcs != 'undefined');
    },
    init : function(){
    },
    ready : function(){
      this.init();
      this.ban.init();
      console.log('demo ready');
    }
  }
  _t = {'demo':demo}
  $(_d).ready(function(){_t.demo.ready()});
})(document, window, {}, jQuery);


