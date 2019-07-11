'use strict';
(function (_d, _w, _t, $) {
  var demo = {
    cmn: {
      supportLocalStorage: function () { return (_w.localStorage !== undefined) },
      setItem: function (key, value) { if (this.supportLocalStorage()) { _w.localStorage.setItem(key, value); return true } return false },
      getItem: function (key) { if (this.supportLocalStorage()) { return _w.localStorage.getItem(key) } return null },
      setItemObj: function (key, value) { return this.setItem(key, JSON.stringify(value)) },
      getItemObj: function (key) { var o = this.getItem(key); if (o) { o = JSON.parse(o) } return o },
      removeItem: function (key) { if (this.supportLocalStorage()) { return _w.localStorage.removeItem(key) } return false },
      clearStorage: function () { if (this.supportLocalStorage()) { return _w.localStorage.clear() } return false },
      set: function (key, value) { _t[key] = value },
      get: function (key) { return _t[key] }
    },
    ban: {
      init: function () {
        _t.demo.clearAlerts()
        _t.demo.hideEl('#SelectBanLookup')
        _t.demo.cmn.set('select_tpl', $('#SelectBanLookup .form-selection .form-check').clone())
        $('#SelectBanLookup .form-selection .form-check').remove()
        $('#ButtonBanLookup').click(_t.demo.ban.lookup)
        $('#ButtonBanChoose').click(_t.demo.ban.select)
      },
      lookup: function (e) {
        _t.demo.ban.clearError()
        _t.demo.hideEl('#SelectBanLookup', false)
        var v = $('#InputBanLookup').val()
        if (v.length === 7 && v.match(/[0-9]/g)) {
          if (_t.demo.isSvcsEnabled()) {
            $('#SelectBanLookup .form-selection').html('')
            _t.demo.ban.loading(true)
            $.get(_w.__svcs.ban + '&id=' + v, _t.demo.ban.selection)
          }
        } else {
          _t.demo.ban.error(false)
        }
      },
      selection: function (d) {
        _t.demo.ban.loading(false)
        if (d.status === 'success' && Array.isArray(d.data.locations) && d.data.locations.length) {
          var data = d.data.locations
          _t.demo.cmn.set('ban_data', data)
          for (var i = 0; i < data.length; i++) {
            var item = _t.demo.cmn.get('select_tpl').clone()
            var itemId = 'select-lin-' + data[i].LIN
            var itemName = 'select-ban-' + data[i].BAN
            var itemText = data[i].DBAName + ', ' + data[i].StreetAddress + ', ' + data[i].City + ', ' + data[i].State + ', ' + data[i].PostalCd + ' (' + data[i].LIN + ')'
            item.children('.form-check-input').attr('id', itemId).attr('name', itemName).attr('data-id', i)
            item.children('.form-check-label').text(itemText).attr('for', itemId)
            $('#SelectBanLookup .form-selection').append(item)
          }
          _t.demo.showEl('#SelectBanLookup', true)
        } else {
          if (d.status === 'error') {
            _t.demo.ban.error(true)
          } else {
            _t.demo.ban.fail()
          }
        }
      },
      select: function () {
        var i = $('#SelectBanLookup .form-selection input:checked').attr('data-id')
        var data = _t.demo.cmn.get('ban_data')
        if (i < data.length) {
          var item = data[i]
          for (var p in item) {
            _t.demo.setInput('input[data-field-name="' + p + '"]', item[p])
          }
          _t.demo.hideEl('#SelectBanLookup', true)
        }
      },
      loading: function (isLoading) {
        if (isLoading) {
          $('#ButtonBanLookup').append('<span class="spinner-border spinner-border-sm ml-3" role="status" aria-hidden="true"></span>')
        } else {
          $("[role='status']").remove()
        }
      },
      error: function (showAlert) {
        $('#InputBanLookup').addClass('is-invalid')
        $('#InputBanLookup ~ .invalid-feedback').show()
        if (showAlert) {
          $('#InputBanLookup ~ .invalid-feedback').hide()
          _t.demo.showEl('#InputBanLookup ~ .alert-danger')
        }
      },
      fail: function () {
        _t.demo.showEl('#InputBanLookup ~ .alert-warning')
      },
      clearError: function () {
        $('#InputBanLookup').removeClass('is-invalid')
        _t.demo.ban.loading(false)
        _t.demo.clearAlerts()
      }
    },
    hideEl: function (el, animate) {
      var duration = animate ? 1000 : 0
      $(el).hide(duration, function () { $(this).addClass('d-none') })
    },
    showEl: function (el, animate) {
      var duration = animate ? 1000 : 0
      $(el).hide().removeClass('d-none')
      $(el).show(duration)
    },
    clearAlerts: function () {
      $('.alert').addClass('d-none')
    },
    setInput: function (el, value) {
      var isReadOnly = $(el).prop('readonly')
      if (isReadOnly) { $(el).prop('readonly', false) }
      $(el).val(value)
      if (isReadOnly) { $(el).prop('readonly', true) }
    },
    isSvcsEnabled: function () {
      return (typeof _w.__svcs !== 'undefined')
    },
    init: function () {
    },
    ready: function () {
      this.init()
      this.ban.init()
      console.log('demo ready')
    }
  }
  _t = { demo: demo }
  $(_d).ready(function () { _t.demo.ready() })
})(document, window, {}, window.jQuery)
