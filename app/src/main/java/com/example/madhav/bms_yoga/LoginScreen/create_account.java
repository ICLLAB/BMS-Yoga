package com.example.madhav.bms_yoga.LoginScreen;


import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.madhav.bms_yoga.HomePage.HomeActivity;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mLogin;
import com.example.madhav.bms_yoga.model.mSignup;
import com.example.madhav.bms_yoga.network.mAPI;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * A simple {@link Fragment} subclass.
 */
public class create_account extends DialogFragment {


    public create_account() {
        // Required empty public constructor
    }

    private EditText ins;
    private EditText ies;
    private EditText ips;
    private Button signUP;
    private TextView input_status;
    private ProgressBar pdia_su;
    private ImageView dis;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_create_account, container, false);

        ins =  view.findViewById(R.id.input_name_su);
        ies =  view.findViewById(R.id.input_email_su);
        ips =  view.findViewById(R.id.input_password_su);
        signUP = view.findViewById(R.id.btn_signup);
        input_status = view.findViewById(R.id.input_status);
        dis = view.findViewById(R.id.imageView_close);
        pdia_su = view.findViewById(R.id.progB_signup);
        pdia_su.setVisibility(View.GONE);

        signUP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                input_status.setText("");
                if( TextUtils.isEmpty(ins.getText()) || TextUtils.isEmpty(ies.getText()) || TextUtils.isEmpty(ips.getText())) {
                    input_status.setText("Fields cannot be left blank");
                    input_status.setTextColor(Color.RED);
                }
                else
                {
                    if(!CheckEmail())
                    {
                        input_status.setText("Invalid Email ID");
                        input_status.setTextColor(Color.RED);
                    }
                    else
                        new LongOperationSignup().execute("");
                }

            }
        });

        dis.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getDialog().dismiss();
            }
        });


        return view;
    }
    private void register() {
        final mSignup msign = new mSignup(ins.getText().toString(),ies.getText().toString(),ips.getText().toString());

        StringRequest postRequest = new StringRequest(Request.Method.POST, mAPI.SIGNUP_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);
                        ins.setText("");
                        ies.setText("");
                        ips.setText("");
                        ins.requestFocus();
                        Toast.makeText(getContext(), "Account has been created successfully",
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
                        input_status.setText("Email ID exists");
                        input_status.setTextColor(Color.RED);
                        pdia_su.setVisibility(View.GONE);
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("username", msign.getmSUsername());
                params.put("email", msign.getmSEmail());
                params.put("password", msign.getmSPassword());
                return params;
            }
        };
        VolleySingleton.getInstance(getContext()).addToRequestQueue(postRequest);
    }

    private class LongOperationSignup extends AsyncTask<String, Void, String> {


        @Override
        protected String doInBackground(String... params) {
            register();
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
            pdia_su.setVisibility(View.GONE);
        }

        @Override
        protected void onPreExecute() {

            pdia_su.setVisibility(View.VISIBLE);

        }

        @Override
        protected void onProgressUpdate(Void... values) {}
    }
    public boolean CheckEmail()
    {
        boolean valid = false;
        String email = ies.getText().toString().trim();
        String emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";
        if (email.matches(emailPattern))
            valid = true;
        else
            valid = false;

        return valid;
    }
    //to do
    /*public boolean isValidPassword(final String password) {

        Pattern pattern;
        Matcher matcher;

        final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{4,}$";

        pattern = Pattern.compile(PASSWORD_PATTERN);
        matcher = pattern.matcher(password);

        return matcher.matches();

    }*/

}
