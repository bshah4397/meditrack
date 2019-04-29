/**
 * grant access transaction
 * @param {meditrack.com.GrantAccess} tx - the sample transaction instance
 * @transaction
 */

async function GrantAccess(tx) {
  const doctorRegistry = await getParticipantRegistry("meditrack.com.Doctor");
  //const patientRegistry = await getParticipantRegistry('meditrack.com.Patient');
  var condition = false;
  return getParticipantRegistry("meditrack.com.Doctor")
    .then(function(participantRegistry) {
      // Determine if the specific driver exists in the driver participant registry.
      return participantRegistry.exists(tx.doctor.getIdentifier());
    })
    .then(function(exists) {
      if (!exists) {
        throw new Error("Doctor does not exist");
      } else {
        //Doctor Else
        return getParticipantRegistry("meditrack.com.Patient")
          .then(function(participantRegistry) {
            // Determine if the specific driver exists in the driver participant registry.
            return participantRegistry.exists(tx.patient.getIdentifier());
          })
          .then(function(exists) {
            if (!exists) {
              throw new Error("Patient does not exist");
            } else {
              //Patient Else
              return getParticipantRegistry("meditrack.com.Patient").then(
                function(patientRegistry) {
                  if (tx.patient.authDoctors == "undefined") {
                    console.log("inside if");
                    tx.patient.authDoctors = new Array();
                    tx.patient.authDoctors[0] = tx.doctor;
                  } else {
                    tx.patient.authDoctors.push(tx.doctor);
                  }
                  return patientRegistry.update(tx.patient);
                }
              );
              //Patient Else
            }
          });
        //Doctor Else
      }
    });
}

/**
 * revoke access transaction
 * @param {meditrack.com.RevokeAccess} tx - the sample transaction instance
 * @transaction
 */

async function RevokeAccess(tx) {
  const doctorRegistry = await getParticipantRegistry("meditrack.com.Doctor");
  //const patientRegistry = await getParticipantRegistry('meditrack.com.Patient');
  var condition = false;
  return getParticipantRegistry("meditrack.com.Doctor")
    .then(function(participantRegistry) {
      // Determine if the specific driver exists in the driver participant registry.
      return participantRegistry.exists(tx.doctor.getIdentifier());
    })
    .then(function(exists) {
      if (!exists) {
        throw new Error("Doctor does not exist");
      } else {
        //Doctor Else
        return getParticipantRegistry("meditrack.com.Patient")
          .then(function(participantRegistry) {
            // Determine if the specific driver exists in the driver participant registry.
            return participantRegistry.exists(tx.patient.getIdentifier());
          })
          .then(function(exists) {
            if (!exists) {
              throw new Error("Patient does not exist");
            } else {
              //Patient Else
              return getParticipantRegistry("meditrack.com.Patient").then(
                function(patientRegistry) {
                  if (tx.patient.authDoctors == "undefined") {
                    throw new Error("No authorised doctor(s) exist");
                  } else {
                    var i = tx.patient.authDoctors.indexOf(tx.doctor);
                    if (i != -1) {
                      tx.patient.authDoctors.splice(i, 1);
                      return patientRegistry.update(tx.patient);
                    } else {
                      throw new Error("Doctor is not authorised");
                    }
                  }
                }
              );
              //Patient Else
            }
          });
        //Doctor Else
      }
    });
}

/**
 * grant access transaction
 * @param {meditrack.com.P2I} tx - the sample transaction instance
 * @transaction
 */
async function P2I(tx) {
  const patientRegistry = await getParticipantRegistry("meditrack.com.Patient");
  const instituteRegistry = await getParticipantRegistry(
    "meditrack.com.Institute"
  );
  tx.sender.balance -= tx.amount;
  tx.collector.balance += tx.amount;
  await patientRegistry.update(tx.sender);
  await instituteRegistry.update(tx.collector);
}

/**
 * grant access transaction
 * @param {meditrack.com.I2D} tx - the sample transaction instance
 * @transaction
 */
async function I2D(tx) {
  const doctorRegistry = await getParticipantRegistry("meditrack.com.Doctor");
  const instituteRegistry = await getParticipantRegistry(
    "meditrack.com.Institute"
  );
  tx.sender.balance -= tx.amount;
  tx.collector.balance += tx.amount;
  await doctorRegistry.update(tx.collector);
  await instituteRegistry.update(tx.sender);
}
