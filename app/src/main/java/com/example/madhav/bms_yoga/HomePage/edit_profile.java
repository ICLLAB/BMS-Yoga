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
public class edit_profile extends DialogFragment {

    EditText email;
    EditText username;
    EditText fname;
    EditText lname;
    Button e_button;
    private ProgressBar pdia_ep;
    ImageView close;
    public edit_profile() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v =  inflater.inflate(R.layout.fragment_edit_profile, container, false);
        email = v.findViewById(R.id.email);
        username = v.findViewById(R.id.username);

        fname = v.findViewById(R.id.fname);
        lname = v.findViewById(R.id.lname);
        close = v.findViewById(R.id.imageView_closeedit);
        pdia_ep = v.findViewById(R.id.progB_edit);
        pdia_ep.setVisibility(View.GONE);
        e_button = v.findViewById(R.id.btn_update);

        e_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                new LongOperationEdit().execute("");
            }
        });
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getDialog().dismiss();
            }
        });
        getInfo();

        return v;
    }


    private void getInfo() {
        SharedPreferences prefs = this.getActivity().getSharedPreferences("email_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("email", null);


        String name="";
        if (restoredText != null) {
            name = prefs.getString("email", "No name defined");//"No name defined" is the default value.
            //Log.d("EMAIL MACHA",name);

            email.setText(name);

        }
        email.setEnabled(false);
        //email.setFocusable(false);
       // Log.d("test",name);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(

                Request.Method.GET,
                mAPI.EDIT_URL + name ,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{
                            // Get the JSON array
                            JSONArray array = response.getJSONArray("user_details");
                            // Loop through the array elements
                            for(int i=0;i<array.length();i++){
                                // Get current json object
                                JSONObject student = array.getJSONObject(i);

                                // Get the current student (json object) data
                                //String e_user = student.getString("username");
                                //String e_fname;
                                String a = checkKey(student, "username");
                                String x = checkKey(student, "f_name");
                                String y = checkKey(student, "l_name");
                                //String e_fname = student.getString("f_name");
                                //String e_lname = student.getString("l_name");
                                //String Quotes = '"'+ hea_tip+'"';
                                //String lastName = student.getString("type");
                                // String age = student.getString("age");

                                // Display the formatted json data in text view
                                //mTextView.append(firstName +" " + lastName +"\nage : " + age);
                                // mTextView.append("\n\n");
                                username.setText(a);
                                fname.setText(x);
                                lname.setText(y);
                                //lname.setText(e_lname);
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

    public String checkKey(JSONObject student, String s) throws JSONException {
        String res="";
        if(student.has(s))
        {
            res= student.getString(s);
        }
        else
            res = "";

        return res ;
    }

    private void editProfile() {
        String edit_email = email.getText().toString();
        //final mSignup msign = new mSignup(ins.getText().toString(),ies.getText().toString(),ips.getText().toString());
        //Log.d("Tset",y);
        StringRequest postRequest = new StringRequest(Request.Method.PUT, mAPI.EDIT_URL + edit_email ,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);

                        Toast.makeText(getContext(), "Account updated successfully",
                                Toast.LENGTH_LONG).show();
                        getDialog().dismiss();
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", String.valueOf(error));
                        Toast.makeText(getContext(), "Error Editing",
                                Toast.LENGTH_LONG).show();
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("username", username.getText().toString());
                params.put("f_name", fname.getText().toString());
                params.put("l_name", lname.getText().toString());
                return params;
            }
        };
        VolleySingleton.getInstance(getContext()).addToRequestQueue(postRequest);
    }

    private class LongOperationEdit extends AsyncTask<String, Void, String> {


        @Override
        protected String doInBackground(String... params) {
            editProfile();
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
            pdia_ep.setVisibility(View.INVISIBLE);
            Log.d("async", "executed");

            // might want to change "executed" for the returned string passed
            // into onPostExecute() but that is upto you
        }

        @Override
        protected void onPreExecute() {

            pdia_ep.setVisibility(View.VISIBLE);

        }

        @Override
        protected void onProgressUpdate(Void... values) {}
    }



}
