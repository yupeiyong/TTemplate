 
$(function () {
    'use strict';

    window.operateFormatter = function (value, row, index) {
        return [
            '<a href="#" class="u-edit"',
                ' data-u-url="/Admin/Manager/InfrastructureSymbol/Edit/' + value + '"',
            '>',
                '编辑',
                '<i class="fa fa-pencil" aria-hidden="true"></i>',
            '</a>',
            '<a href="#" class="u-delete"',
                ' data-u-url="/Admin/Manager/InfrastructureSymbol/Remove/' + value + '"',
            '>',
                '删除',
                '<i class="fa fa-trash" aria-hidden="true"></i>',
            '</a>'
        ].join('');
    };
    var $table = $('#tab');
    //为自定义列设置事件
    function addCustColClick() {
        //编辑
        $('#btnAdd,.table .u-edit').off('click').on('click', function () {
            var $this = $(this);

            var title = '新增';
            var isModify = $this.hasClass('u-edit');
            if (isModify) {
                var $tr = $this.closest('tr');
                var rowId = $tr[0].id;
                if (!rowId || rowId.length <= 0) {
                    return false;
                }
                title = '编辑 '+rowId;
            }

            
            //获取链接路径
            var url = $(this).data('u-url');

            //弹窗显示详情
            BootstrapDialog.show({
                title: title,
                size: BootstrapDialog.SIZE_NORMAL,
                closable: true,
                closeByBackdrop: false,
                closeByKeyboard: true,
                draggable: true,
                message: $('<div></div>').load(url),
                onshown: function (dialogRef) {

                    var $form = dialogRef.$modalBody.find('form');

                    $form.eq(0).validate(
                         {
                             rules: {
                                 CustomedNumber: {
                                     required: true
                                 }
                             },
                             messages: {
                                 CustomedNumber: {
                                     required: '必填项'
                                 }
                             }
                         }
                    );

                    //添加按钮添加事件处理函数
                    dialogRef.$modalBody.find('#btnSave').off('click').on('click', function () {
                        //当前对象
                        var $this = $(this);
                        var $closeBtn = dialogRef.$modalHeader.find('button.close');
                        //检测验证结果
                        if (!$form.valid()) {
                            return false;
                        }

                        var url = $this.data('url');
                        //保存
                        var data = $form.serializeArray();
                        var btnText = $this.text();
                        console.info(data);
                        $.ajax({
                            url: url,
                            type: 'json',
                            data: data,
                            beforeSend: function () {
                                $this.attr("disabled", true);
                                $closeBtn.attr("disabled", true);
                                
                                $this.text('保存中...');
                            },
                            success: function (data) {
                                layer.msg(data.Message, { time: 5000 });
                                if (data.Success) {
                                    $this.closest('.bootstrap-dialog').modal('hide');
                                    $table.bootstrapTable('refresh');
                                }
                                $this.attr("disabled", false);
                                $closeBtn.attr("disabled", false);
                                $this.text(btnText);
                            },
                            error: function (xhr, error, errThrow) {
                                layer.msg(errThrow, { time: 5000 });
                            },
                            complete: function (msg, textStatus) {
                                $this.attr("disabled", false);
                                $closeBtn.attr("disabled", false);
                                $this.text(btnText);
                            }
                        });
                        //不执行提交动作
                        return false;
                    });
                }
            });

            return false;
        });
        //删除
        $('.table .u-delete').off('click').on('click', function (e) {
            //不执行默认行为
            e.preventDefault();
            //当前对象
            var $this = $(this);

            var $tr = $this.closest('tr');
            var rowId = $tr[0].id;
            if (!rowId || rowId.length <= 0) {
                return false;
            }

            //获取链接路径
            var url = $this.data('u-url');
            //确认删除
            BootstrapDialog.confirm({
                title: '删除',
                message: '确认删除第' + rowId + '条记录吗?',
                type: BootstrapDialog.TYPE_WARNING,
                closable: true,
                draggable: true,
                btnCancelLabel: '取消',
                btnOKLabel: '确认',
                btnOKClass: 'btn-warning',
                callback: function (result) {
                    if (result) {
                        $.post(url, null, function (data) {
                            layer.msg(data.Message, { time: 5000 });
                            if (data.Success) {
                                var $this = $(this);
                                $this.closest('.bootstrap-dialog').modal('hide');
                                $table.bootstrapTable('refresh');
                            }
                        });
                    } else {
                        var $this = $(this);
                        $this.closest('.bootstrap-dialog').modal('hide');
                    }
                }
            });
            return false;
        });
    }

    $table.extendBootstrapTable({
        searchButton: '#btnSearch',
        searchForm: 'form.search'
    }).on('load-success.bs.table', function () {
        //处理获取到的数据
        addCustColClick();
    });
});
