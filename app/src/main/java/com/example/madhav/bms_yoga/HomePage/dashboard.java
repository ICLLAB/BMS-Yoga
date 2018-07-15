package com.example.madhav.bms_yoga.HomePage;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;

import android.support.v7.widget.Toolbar;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import com.example.madhav.bms_yoga.R;

import java.util.ArrayList;

public class dashboard extends Fragment {
    TextView tipP;
    private static final String TAG = "dashboard";

    //vars
    private ArrayList<String> mNames = new ArrayList<>();
    private ArrayList<String> mClassCount = new ArrayList<>();
    // private ArrayList<String> mImageUrls = new ArrayList<>();
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setHasOptionsMenu(true);//Make sure you have this line of code.

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_dashboard, container, false);
        android.support.v7.widget.Toolbar myToolbar = (android.support.v7.widget.Toolbar) v.findViewById(R.id.my_toolbar);

        ((AppCompatActivity) getActivity()).setSupportActionBar(myToolbar);

        tipP = v.findViewById(R.id.tip);
        tipP.setText(getActivity().getIntent().getStringExtra("puttip"));
        return v;
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.dashboard_menu, menu);
        super.onCreateOptionsMenu(menu, inflater);
        getInfo();
    }

    private void getInfo(){
        Log.d(TAG, "initImageBitmaps: preparing bitmaps.");
        // mImageUrls.add("https://c1.staticflickr.com/5/4636/25316407448_de5fbf183d_o.jpg");
        mNames.add("No. of Sessions");
        mClassCount.add("12");
        //mImageUrls.add("https://i.redd.it/tpsnoz5bzo501.jpg");
        mNames.add("Health Score");
        mClassCount.add("03");
        initRecyclerView();

    }
    private void initRecyclerView(){
        //Log.d(TAG, "initRecyclerView: init recyclerview");

        LinearLayoutManager layoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false);



        //RecyclerView recyclerView = getContext().findViewById(R.id.);
        RecyclerView recyclerView = (RecyclerView) getActivity().findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(layoutManager);

        RecyclerViewAdapter adapter = new RecyclerViewAdapter(mNames,mClassCount);
        recyclerView.setAdapter(adapter);





    }



}




