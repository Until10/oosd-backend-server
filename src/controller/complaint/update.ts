import { Handler, EmailBuilder, emailSender } from "../../core";
import { MErr, model } from "../../database";

export const writeLogEntry: Handler = async (req, res) => {
    const { r } = res;
    const userId = req.user.userId;
    const { complaintId } = req.params;
    const { subject, description } = req.body;

    const error = await model.complaint.updateComplaintLog(
        complaintId,
        userId,
        {
            subject, description
        }
    );

    if (error == MErr.NO_ERRORS) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }

    r.send_ISE();
}

export const markAsAwaitingApproval: Handler = async (req, res) => {
    req.body.status = "Awaiting Approval"
    if (!req.body.subject) {
        req.body.subject = "For Approval"
        req.body.description = `Complaint marked as Awaiting Approval by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
};

export const markAsApproved: Handler = async (req, res) => {
    req.body.status = "Approved"
    if (!req.body.subject) {
        req.body.subject = "Approved"
        req.body.description = `Complaint approved by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
};

export const markForDivisionalAccept: Handler = async (req, res) => {
    req.body.status = "Awaiting Accept"
    if (!req.body.subject) {
        req.body.subject = "For Accept"
        req.body.description = `Complaint is marked for Acceptation`
    }
    updateStatusManual(req, res, () => {});
};

export const markAsAccepted: Handler = async (req, res) => {
    req.body.status = "In Progress"
    if (!req.body.subject) {
        req.body.subject = "Accepted"
        req.body.description = `Complaint is accepted by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
    emailSender.sendMail(await EmailBuilder.complaintAccept(req.params.complaintId))
};

export const markForDivReview: Handler = async (req, res) => {
    req.body.status = "Awaiting Div Sec Review"
    if (!req.body.subject) {
        req.body.subject = "For Divisional Secretariat Review"
        req.body.description = `Complaint is marked for Divisional Secretariat Review`
    }
    updateStatusManual(req, res, () => {});
};

export const markAsFDivReviewed: Handler = async (req, res) => {
    req.body.status = "Div Sec Reviewed"
    if (!req.body.subject) {
        req.body.subject = "Reviewed"
        req.body.description = `Complaint is reviewed by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
};

export const markForDisReview: Handler = async (req, res) => {
    req.body.status = "Awaiting Dis Sec Review"
    if (!req.body.subject) {
        req.body.subject = "For District Secretariat Review"
        req.body.description = `Complaint is marked for District Secretariat Review`
    }
    updateStatusManual(req, res, () => {});
};



export const markAsDisReviewed: Handler = async (req, res) => {
    req.body.status = "Dis Sec Reviewed"
    if (!req.body.subject) {
        req.body.subject = "Reviewed"
        req.body.description = `Complaint is reviewed by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
};

export const markAsSolved: Handler = async (req, res) => {
    req.body.status = "Solved"
    if (!req.body.subject) {
        req.body.subject = "Resolved"
        req.body.description = `Complaint is marked as resolved by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
    emailSender.sendMail(await EmailBuilder.complaintResolved(req.params.complaintId))
};

export const markAsRejected: Handler = async (req, res) => {
    req.body.status = "Rejected"
    if (!req.body.subject) {
        req.body.subject = "Resolved"
        req.body.description = `Complaint is marked as rejected by ${req.user.firstName}`
    }
    updateStatusManual(req, res, () => {});
    emailSender.sendMail(await EmailBuilder.complaintReject(req.params.complaintId))
};


export const updateStatusManual: Handler = async (req, res) => {
    const { r } = res;
    const userId = req.user.userId;
    const { complaintId } = req.params;
    const { status, subject, description } = req.body;

    const error = await model.complaint.updateComplaintStatus(
        complaintId,
        userId,
        {
            status, subject, description
        }
    );

    if (error == MErr.NO_ERRORS) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }

    r.send_ISE();
};