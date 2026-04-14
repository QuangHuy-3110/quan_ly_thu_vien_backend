const DocgiaService = require('../services/docgia.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.tenDG){
        return next(new ApiError(400, 'Name can not be empty'));
    }

    if (!req.body?._id){
        return next(new ApiError(400, 'Id can not be empty'));
    }

    try {
        const docgiaService = new DocgiaService(MongoDB.client);        
        const document = await docgiaService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the contact")
        );
    }

    // res.send ({message: "sdafafd"});
}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const {name} = req.query;
        const {taikhoanDG} = req.query;
        if (name) {
            documents = await docgiaService.findByName(name);
        }else if(taikhoanDG){
            documents = await docgiaService.findByTaiKhoan(taikhoanDG);
        } else {
            documents = await docgiaService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retrieving contacts')
        );
    }
    return res.send(documents); 
};

exports.findOne = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        
        const document = await docgiaService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error occurred while retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.update(req.params.id, req.body);
        if (document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send({message: 'Contact was updated successfully'});	
    }catch (error){
        return next(
            new ApiError(500,`Error occurred while updating contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send({message: 'Contact was deleted successfully'});
    }catch (error){
        return next(
            new ApiError(500, `Error occurred while deleting contact with id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const deletedCount = await docgiaService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`
        });
    } catch (error){
        return next (
            new ApiError(500, 'An error occurred while deleting contacts')
        );
    }
}

