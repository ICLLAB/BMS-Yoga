package com.example.madhav.bms_yoga.HomePage;

import android.app.Activity;
import android.app.ProgressDialog;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
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
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.madhav.bms_yoga.LoginScreen.create_account;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.network.mAPI;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static android.content.Context.MODE_PRIVATE;

public class dashboard extends Fragment {
    TextView tipP;
    ImageView schedule_icon;
   // private final static int INTERVAL = 5000;//1000 * 60 * 2; //2 minutes
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
        schedule_icon = v.findViewById(R.id.schedule_icon);



        schedule_icon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FragmentManager fm = getActivity().getSupportFragmentManager();
                schedule myDialogFragment = new schedule();
                myDialogFragment.show(fm, "schedule_fragment");

            }
        });
        mHandler = new Handler();

        startRepeatingTask();

        //tipP.setText(getActivity().getIntent().getStringExtra("puttip"));
        return v;
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.dashboard_menu, menu);
        super.onCreateOptionsMenu(menu, inflater);

        Attendence();


    }
   /* private void getInfo(){
        //Log.d(TAG, "initImageBitmaps: preparing bitmaps.");
        // mImageUrls.add("https://c1.staticflickr.com/5/4636/25316407448_de5fbf183d_o.jpg");
        String c = "12";




    }*/
    private void initRecyclerView(){


        LinearLayoutManager layoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false);


        RecyclerView recyclerView = (RecyclerView) getActivity().findViewById(R.id.recyclerView);

        //imgView_g.setVisibility(View.INVISIBLE);

        recyclerView.setLayoutManager(layoutManager);

        RecyclerViewAdapter adapter = new RecyclerViewAdapter(mNames,mClassCount);
        recyclerView.setAdapter(adapter);



    }

    private int mInterval = 10000; // 10 seconds refresh
    private Handler mHandler;
    Runnable mStatusChecker = new Runnable() {
        @Override
        public void run() {
            try {
                getTip(); //this function can change value of mInterval.


            } finally {
                // 100% guarantee that this always happens, even if
                // your update method throws an exception
                mHandler.postDelayed(mStatusChecker, mInterval);
            }
        }
    };

    void startRepeatingTask() {
        //Log.d("called","tip");
        mStatusChecker.run();
    }

    void stopRepeatingTask() {
        mHandler.removeCallbacks(mStatusChecker);
    }


    private void getTip() {

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                mAPI.TIP_URL,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{
                            // Get the JSON array
                            JSONArray array = response.getJSONArray("tip");
                            // Loop through the array elements
                            for(int i=0;i<array.length();i++){
                                // Get current json object
                                JSONObject student = array.getJSONObject(i);
                                //Log.d("test", String.valueOf(response.get("count")));
                                // Get the current student (json object) data
                                String hea_tip = student.getString("health_tip");
                                String Quotes = '"'+ hea_tip+'"';
                                //String lastName = student.getString("type");
                                // String age = student.getString("age");

                                // Display the formatted json data in text view
                                //mTextView.append(firstName +" " + lastName +"\nage : " + age);
                                // mTextView.append("\n\n");
                               // tipP.setText(response.get("count") + Quotes);
                                tipP.setText(Quotes);
                               /*Intent n = new Intent(LoginScreenActivity.this, HomeActivity.class);
                               n.putExtra("puttip",Quotes);

                               startActivity(n);*/


                            }
                        }catch (JSONException e){
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error){
                        // Do something when error occurred
                        Log.d("Error.Response", String.valueOf(error));
                    }
                }
        );

        // Add JsonObjectRequest to the RequestQueue
        // requestQueue.add(jsonObjectRequest);
        VolleySingleton.getInstance(getContext()).addToRequestQueue(jsonObjectRequest);
    }

    private void Attendence() {

        SharedPreferences prefs = this.getActivity().getSharedPreferences("email_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("email", null);


        String name="";
        if (restoredText != null) {
            name = prefs.getString("email", "No name defined");//"No name defined" is the default value.
            //Log.d("EMAIL MACHA",name);

        }

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                mAPI.ATT_URL + name,
                null,

                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{

                            // Get the JSON array
                            JSONArray array = response.getJSONArray("LAST_7_DAYS_ATTENDANCE_OF_PARTICULAR_USER");
                            // Loop through the array elements

                            mNames.add("No. of Sessions");
                            //Log.d("test",response.get("total").toString());
                            mClassCount.add(response.get("total").toString());

                            //mImageUrls.add("https://i.redd.it/tpsnoz5bzo501.jpg");
                            mNames.add("Health Score");
                            mClassCount.add("0");

                            initRecyclerView();
                            /*for(int i=0;i<array.length();i++){
                                // Get current json object
                                JSONObject student = array.getJSONObject(i);
                                //Log.d("test", String.valueOf(response.get("count")));
                                // Get the current student (json object) data
                            //    String hea_tip = student.getString("health_tip");
                            //    String Quotes = '"'+ hea_tip+'"';
                                //String lastName = student.getString("type");
                                // String age = student.getString("age");

                                // Display the formatted json data in text view
                                //mTextView.append(firstName +" " + lastName +"\nage : " + age);
                                // mTextView.append("\n\n");
                                 //tipP.setText(response.get("total") + Quotes);



                               // tipP.setText(Quotes);
                               /*Intent n = new Intent(LoginScreenActivity.this, HomeActivity.class);
                               n.putExtra("puttip",Quotes);

                               startActivity(n);


                            }*/
                        }catch (JSONException e){
                            e.printStackTrace();
                        }

                    }

                },
                new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error){
                        // Do something when error occurred
                        Log.d("Error.Response", String.valueOf(error));
                    }
                }
        );

        // Add JsonObjectRequest to the RequestQueue
        // requestQueue.add(jsonObjectRequest);
        VolleySingleton.getInstance(getContext()).addToRequestQueue(jsonObjectRequest);
    }







}




