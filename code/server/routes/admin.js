const express = require('express');
const router = express.Router();
const { handleErrors, listCollection, deleteCollection, updateCollection } = require('../utils/express');
const { upload, createImagePath, removeFiles } = require('../utils/upload');
const User = require('../models/User')
const Zone = require('../models/Zone')
const Agency = require('../models/Agency')
const userSchema = require('../middleware/schema/user')
const zoneSchema = require('../middleware/schema/zone')
const agencySchema = require('../middleware/schema/agency')
const sameQueries = require('./utils')
const requestMiddleware = require('../middleware/request');


router.get('/users/:role?', requestMiddleware(userSchema.admin.user.listByRole, 'params'), handleErrors(async (req, res) => {
    const role = req.params.role ? { role: req.params.role } : {};
    const { list } = await User.list(role);
    res.json({ list });
}));


// Zone
router.get('/agency-zone', listCollection(async ({ offset, limit }) => {
    let { list } = await Zone.list({ offset, limit });
    list.sort((a, b) => a.position - b.position);
    return { list }
}));

router.post('/agency-zone', requestMiddleware(zoneSchema.admin.post), handleErrors(async (req, res) => {
    await Zone.add(req.body);
    const list = await Zone.list();
    res.json(list);
}));

router.put('/agency-zone/:id', updateCollection(requestMiddleware(zoneSchema.admin.update),
    async ({ id, data }) => await Zone.update(id, data))
);
router.delete('/agency-zone/:id', deleteCollection(async ({ id }) => {
    await Zone.delete(id);
    const list = await Zone.list();
    return list;
}));


// Agency
router.post('/agency', requestMiddleware(agencySchema.admin.post), handleErrors(async (req, res) => {
    const body = req.body;

    try {
        await Zone.get(body.id);
        const { elem } = await Agency.add(req.body);

        await Zone.addAgency(body.id, elem._id);

        const list = await Zone.list();
        res.json(list);
    } catch (error) {
        res.json({ 'errors': 'Error while adding', error })
    }
}));

router.put('/agency/:id', updateCollection(requestMiddleware(agencySchema.admin.update),
    async ({ id, data }) => await Agency.update(id, data))
);
router.delete('/agency/:id', deleteCollection(async ({ id }) => {
    await Agency.delete(id);
    const list = await Zone.list();
    return list;
}));



sameQueries.forEach(({ name: { singular, plural }, model, schema }) => {
    router.get(`/${plural}`, listCollection(async ({ offset, limit }) => {
        let { list } = await model.list({ offset, limit });
        list.sort((a, b) => a.position - b.position);
        return { list }
    }));

    router.put(`/${plural}/swapPosition`, requestMiddleware(schema.swapPosition), handleErrors(async (req, res) => {
        const { first, second } = req.body;

        if (first._id == second._id || first.position == second.position)
            throw 'Values must be unique';
        const data = await model.swapPosition(Object.keys(req.body).map(e => req.body[e]));
        res.json(data)
    }));

    router.post(`/${singular}`, upload(plural).any('pictures'), requestMiddleware(schema.post), handleErrors(async (req, res) => {
        let newData = req.body;
        const files = req.files || [];
        const filesPath = files.map(e => createImagePath(e.path));

        delete newData.pictures;

        newData.picture = filesPath;

        const data = await model.add(newData)
        res.json(data);
    }));

    router.put(`/${singular}/:id`, updateCollection(requestMiddleware(schema.update),
        async ({ id, data }) => await model.update(id, data))
    );

    router.delete(`/${singular}/:id`, deleteCollection(async ({ id }) => {
        const elem = await model.get(id);

        removeFiles(elem.picture);
        await model.delete(id);
    }));
})




module.exports = router;