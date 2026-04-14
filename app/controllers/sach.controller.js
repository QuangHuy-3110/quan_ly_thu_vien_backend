const SachService = require('../services/sach.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.tenSach){
        console.log(req.body?.tenSach)
        return next(new ApiError(400, 'Tên không được bỏ trống'));
    }

    if (!req.body?.maNXB){
        return next(new ApiError(400, 'Mã nhà xuất bản không được bỏ trống'));
    }

    if (!req.body?._id){
        return next(new ApiError(400, 'Id không được bỏ trống'));
    }

    try {
        const sachService = new SachService(MongoDB.client);        
        const document = await sachService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "Có lỗi trong khi tạo sách mới")
        );
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const sachService = new SachService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await sachService.findByName(name);
        } else {
            documents = await sachService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'Có lỗi xảy ra khi tìm sách')
        );
    }
    return res.send(documents); 
};

exports.findOne = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        
        const document = await sachService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'Sách không tồn tại'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Có lỗi xảy ra trong khi tìm kiếm id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cập nhật không được để trống'));
    }

    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.update(req.params.id, req.body);
        if (document) {
            return next(new ApiError(404, 'Sách không tồn tại'));
        }
        return res.send({message: 'Sách được cập nhật thành công'});	
    }catch (error){
        return next(
            new ApiError(500,`Có lỗi xảy ra trong khi cập nhật id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Sách không tồn tại'));
        }
        return res.send({message: 'Sách được xóa thành công'});
    }catch (error){
        return next(
            new ApiError(500, `Có lỗi xảy ra trong khi xóa id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const deletedCount = await sachService.deleteAll();
        return res.send({
            message: `${deletedCount} sách được xóa thành công`
        });
    } catch (error){
        return next (
            new ApiError(500, 'Có lỗi xảy ra trong khi xóa')
        );
    }
}