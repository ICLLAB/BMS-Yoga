package com.example.madhav.bms_yoga.HomePage;


import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mSchedule;
import com.example.madhav.bms_yoga.model.mSignup;
import com.example.madhav.bms_yoga.network.mAPI;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static android.content.Context.MODE_PRIVATE;

/**
 * A simple {@link Fragment} subclass.
 */
public class schedule extends DialogFragment {
    ImageView imageView_closeSch;
    ProgressBar progB_book;
    Button btn_book;
    public schedule() {
        // Required empty public constructor
    }

    //mobile schedile date , centre , slot
    private EditText msd;
    private EditText msc;
    private EditText mss;
    private EditText sc;



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v =  inflater.inflate(R.layout.fragment_schedule, container, false);
        imageView_closeSch = v.findViewById(R.id.imageView_closeSch);
        progB_book = v.findViewById(R.id.progB_book);
        btn_book = v.findViewById(R.id.btn_book);
        msd = v.findViewById(R.id.input_name_date);
        msc = v.findViewById(R.id.input_centre);
        mss = v.findViewById(R.id.input_slot);
        sc = v.findViewById(R.id.session_count);
        sc.setEnabled(false);
        getSessionsCount();
        progB_book.setVisibility(View.GONE);

        imageView_closeSch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getDialog().dismiss();
            }
        });
        btn_book.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                new LongOperationBook().execute("");
            }
        });
        return v;
    }


    private void book() {
        final mSchedule msch = new mSchedule(msd.getText().toString(),msc.getText().toString(),mss.getText().toString());
        SharedPreferences prefs = this.getActivity().getSharedPreferences("email_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("email", null);

        StringRequest postRequest = new StringRequest(Request.Method.POST, mAPI.TRAIL_URL+restoredText,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);

                        Toast.makeText(getContext(), "Your class is scheduled on "+msd.getText(),
                                Toast.LENGTH_LONG).show();
                        msd.setText("");
                        msc.setText("");
                        mss.setText("");
                        msd.requestFocus();
                        getDialog().dismiss();
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", String.valueOf(error));
                        Toast.makeText(getContext(), "Empty fields",
                                Toast.LENGTH_LONG).show();
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("date", msch.getmSchDate());
                params.put("center", msch.getmSchCentre());
                params.put("slot", msch.getmSchSlot());
                return params;
            }
        };
        VolleySingleton.getInstance(getContext()).addToRequestQueue(postRequest);
    }

    private void getSessionsCount() {
        SharedPreferences prefs = this.getActivity().getSharedPreferences("email_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("email", null);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
               mAPI.GET_SESSION_URL + restoredText,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{
                            // Get the JSON array
                          //  JSONArray array = response.getJSONArray("TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS");
                            String scT = response.get("TOTAL_COUNT_OF_SESSION_BOOKED_BY_USERS").toString();
                            sc.setText(scT);


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





    private class LongOperationBook extends AsyncTask<String, Void, String> {


        @Override
        protected String doInBackground(String... params) {

            book();
            for (int i = 0; i < 5; i++) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.interrupted();
                }
            }


            return "Executed";
        }

        @Override
        protected void onPostExecute(String result) {
            //TextView txt = (TextView) findViewById(R.id.output);
            // txt.setText("Executed"); // txt.setText(result);
            progB_book.setVisibility(View.INVISIBLE);
            //Log.d("async", "executed");

            // might want to change "executed" for the returned string passed
            // into onPostExecute() but that is upto you
        }

        @Override
        protected void onPreExecute() {

            progB_book.setVisibility(View.VISIBLE);

        }

        @Override
        protected void onProgressUpdate(Void... values) {}
    }

}
