//route
const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/RequestController');
const auth = require('../helpers/auth');

//const { auth } = require("../../utils/authentication");
router.get('/viewMyRequest', auth.AcademicMemberAuth, RequestController.viewmyRequests);
//router.get("/viewMyRequest/:id",auth.AcademicMemberAuth,RequestController.viewmyReequests);
router.get('/viewMyRequeststatus/:status', auth.AcademicMemberAuth, RequestController.viewmyReequestsByStatus);
router.get('/viewMyRequestType/:type', auth.AcademicMemberAuth, RequestController.viewmyReequestsByType);
router.get('/viewRecievedReplacementRequest', auth.AcademicMemberAuth, RequestController.viewRecievedReplacementRequest);
router.get('/viewSlotRequest', auth.CCAuth, RequestController.viewSlotRequest);
router.get('/viewRecievedRequest/:type', auth.HODAuth, RequestController.viewRecievedRequest);
router.get('/viewNotification', auth.AcademicMemberAuth, RequestController.viewNotification);
router.put('/AcceptOrRejectRep/:id', auth.AcademicMemberAuth, RequestController.AcceptOrRejectRep);
router.put('/AcceptOrRejectChangeDay/:id', auth.HODAuth, RequestController.AcceptOrRejectChangeDay);
router.put('/AcceptOrRejectSlot/:id', auth.CCAuth, RequestController.AcceptOrRejectSlot);
router.put('/AcceptOrRejectLeave/:id', auth.HODAuth, RequestController.AcceptOrRejectLeave);
router.delete('/CancelRequest/:id', auth.AcademicMemberAuth, RequestController.CancelRequest);

router.post('/checkRep',RequestController.chechRep);
router.get('/dayOff',RequestController.getDayOff);
router.get('/hisCourses',RequestController.getCourses);
router.get('/viewReq/:id',RequestController.viewRequestA);     
//const { auth } = require("../../utils/authentication");
//router.get("/viewMyRequest",RequestController.viewmyReequests);
// //with staus
// router.get("/viewMyRequest/:type ",RequestController.viewTypeOfRequests) ;
// router.get("/viewMyRequest/:status ",RequestController.viewStatusOfRequests) ;

// router.get("/viewMyRequest/:type ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:status ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:day ",RequestController.viewSendedRequests) ;

//TODO add replacment
router.post('/sendrequest', RequestController.sendRequest);

router.put('/acceptRejectSlotLinking', auth.CCAuth, RequestController.slotLinkingReqResponse);

// to get request by id
router.get('/viewRequest/:id', RequestController.viewRequest);

module.exports = router;
