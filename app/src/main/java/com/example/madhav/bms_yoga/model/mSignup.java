package com.example.madhav.bms_yoga.model;

public class mSignup {

    private String mSUsername;
    private String mSEmail;
    private String mSPassword;

    public mSignup(String mSUsername, String mSEmail, String mSPassword) {
        this.mSUsername = mSUsername;
        this.mSEmail = mSEmail;
        this.mSPassword = mSPassword;
    }

    public String getmSUsername() {
        return mSUsername;
    }

    public String getmSEmail() {
        return mSEmail;
    }

    public String getmSPassword() {
        return mSPassword;
    }
}
