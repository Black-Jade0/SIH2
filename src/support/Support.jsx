import React from 'react';
// import CandidateProfile from './components/UserProfile/CandidateProfile';
// import EducatorProfile from './components/UserProfile/EducatorProfile';
import DataSecurity from './DataSecurity';
import UserPermissions from './UserPermissions';
// import ManageRegions from './components/AdminSettings/ManageRegions';
// import Tutorials from './components/Support/Tutorials';
import ContactSupport from './ContactSupport';

function Support() {
  return (
    <div className="min-h-screen box-border w-full bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <CandidateProfile />
          <EducatorProfile /> */}
          <DataSecurity />
          <UserPermissions />
          {/* <ManageRegions />
          <Tutorials /> */}
          <ContactSupport />
        </div>
      </div>
    </div>
  );
}

export default Support;
