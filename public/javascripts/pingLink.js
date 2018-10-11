$(document).ready(function () {
  const dataTableOption = {
    'processing': true,
    'serverSide': true,
    'deferRender': true,
    'bLengthChange': false,
    'pageLength': 10,
    'autoWidth': false,
    'ajax': {
      'url': window.location.href,
      'type': 'GET',
      'dataType': 'json'
    },
    'order': [
      [0, 'desc']
    ], // userDate
    'columns': [{
      'data': '_id',
      'class': 'text-center',
      'orderable': false,
      'render': function (data, type, row) {
        return '<a href="#">' + row._id + '</a>';
      }
    }, {
      'data': 'link',
      'class': 'text-center',
      'orderable': false,
      'render': function (data, type, row) {
        return '<a href="' + row.link + '" target="_blank">' + row.link + '</a>';
      }
    }, {
      'class': 'text-center',
      'orderable': false,
      'render': function (data, type, row) {
        return '<button class="btn btn-danger btn-delete" data-id="' + row._id + '" id="user_' + row._id + '" type="button">' + 'Delete' + '</button>';
      }
    }]
  };

  const dataTable = $('#pingTable').DataTable(dataTableOption);

  $('input[type="submit"]').click(function (event) {
    event.preventDefault();

    const data = {
      link: $('input[name="link"]').val()
    }

    $.ajax({
      type: 'POST',
      url: "/",
      data: data,
    }).done((res) => {
      if (res.status == 'ok') {
        dataTable.ajax.reload();
        flashNotic(res.msg, 'success');
      } else {
        flashNotic(res.msg, 'danger');
      }
    }).catch((err) => {
    });
  });

  $(document).on('click', 'button.btn-delete', function(event) {
    const data = {
      linkId: $(this).attr('data-id')
    }

    $.ajax({
      type: 'POST',
      url: "/deleteLink/",
      data: data,
    }).done((res) => {
      if (res.status == 'ok') {
        dataTable.ajax.reload();
        flashNotic(res.msg, 'success');
      } else {
        flashNotic(res.msg, 'danger');
      }
    }).catch((err) => {
    });
  });
});

flashNotic = function (msg, status) {
  $('.oneline-notic').hide();
  const selector = '.oneline-notic.oneline-notic-' + status;
  $(selector).html(msg);
  $(selector).fadeIn();
  setTimeout(() => {
    $(selector).fadeOut();
  }, 1200)
};