package com.example.madhav.bms_yoga.model;

public class mSchedule {
    private String mSchDate;
    private String mSchCentre;
    private String mSchSlot;

    public mSchedule(String mSchDate, String mSchCentre, String mSchSlot) {
        this.mSchDate = mSchDate;
        this.mSchCentre = mSchCentre;
        this.mSchSlot = mSchSlot;
    }

    public String getmSchDate() {
        return mSchDate;
    }

    public String getmSchCentre() {
        return mSchCentre;
    }

    public String getmSchSlot() {
        return mSchSlot;
    }
}
