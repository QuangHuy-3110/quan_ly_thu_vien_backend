const NXBService = require('../services/nxb.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.tenNXB){
        return next(new ApiError(400, 'Tên không được bỏ trống'));
    }

    if (!req.body?._id){
        return next(new ApiError(400, 'Mã nhà xuất bản không được bỏ trống'));
    }

    try {
        const nxbService = new NXBService(MongoDB.client);        
        const document = await nxbService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "Có lỗi trong khi tạo NXB mới")
        );
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const nxbService = new NXBService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await nxbService.findByName(name);
        } else {
            documents = await nxbService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'Có lỗi xảy ra khi tìm NXB')
        );
    }
    return res.send(documents); 
};

exports.findOne = async (req, res, next) => {
    try {
        const nxbService = new NXBService(MongoDB.client);
        
        const document = await nxbService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'NXB không tồn tại'));
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
        const nxbService = new NXBService(MongoDB.client);
        const document = await nxbService.update(req.params.id, req.body);
        if (document) {
            return next(new ApiError(404, 'NXB không tồn tại'));
        }
        return res.send({message: 'NXB được cập nhật thành công'});	
    }catch (error){
        return next(
            new ApiError(500,`Có lỗi xảy ra trong khi cập nhật id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const nxbService = new NXBService(MongoDB.client);
        const document = await nxbService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'NXB không tồn tại'));
        }
        return res.send({message: 'NXB được xóa thành công'});
    }catch (error){
        return next(
            new ApiError(500, `Có lỗi xảy ra trong khi xóa id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const nxbService = new NXBService(MongoDB.client);
        const deletedCount = await nxbService.deleteAll();
        return res.send({
            message: `${deletedCount} NXB được xóa thành công`
        });
    } catch (error){
        return next (
            new ApiError(500, 'Có lỗi xảy ra trong khi xóa')
        );
    }
}