package com.example.madhav.bms_yoga.LoginScreen;


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
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mLogin;
import com.example.madhav.bms_yoga.network.mAPI;

import java.util.HashMap;
import java.util.Map;

import static com.example.madhav.bms_yoga.network.mAPI.FORGOT_URL;

/**
 * A simple {@link Fragment} subclass.
 */
public class forgot_password extends DialogFragment {
EditText infw;
    private Button infwb;
    private ImageView disF;
    private TextView input_status;
    private ProgressBar pdia_fp;
    public forgot_password() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view=  inflater.inflate(R.layout.fragment_forgot_password, container, false);
        infw = view.findViewById(R.id.input_email_fp);
        infwb = view.findViewById(R.id.btn_fp);
        input_status= view.findViewById(R.id.input_status);
        disF = view.findViewById(R.id.imageViewF_close);
        pdia_fp = view.findViewById(R.id.progB_fgt);
        pdia_fp.setVisibility(View.GONE);

        infwb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                input_status.setText("");
                if( TextUtils.isEmpty(infw.getText())){
                    input_status.setText("Email ID cannot be left blank");
                    input_status.setTextColor(Color.RED);
                }else{
                    if(!CheckEmail())
                    {
                        input_status.setText("Invalid Email ID");
                        input_status.setTextColor(Color.RED);
                    }
                    else
                        new LongOperationForgot().execute("");
                }
            }
        });

        disF.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getDialog().dismiss();
            }
        });
        return view;
    }

    private void fpw() {
       // final mLogin mlog = new mLogin(emailText.getText().toString(),pwText.getText().toString());

        StringRequest postRequest = new StringRequest(Request.Method.POST, mAPI.FORGOT_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);
                        Toast.makeText(getContext(), "Email has been sent successfully",
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
                        input_status.setText("Email ID doesn't exist");
                        input_status.setTextColor(Color.RED);
                        pdia_fp.setVisibility(View.GONE);
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("email", infw.getText().toString());
                return params;
            }

        };
        VolleySingleton.getInstance(getContext()).addToRequestQueue(postRequest);
    }

    private class LongOperationForgot extends AsyncTask<String, Void, String> {


        @Override
        protected String doInBackground(String... params) {
            fpw();
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

            pdia_fp.setVisibility(View.GONE);

        }

        @Override
        protected void onPreExecute() {

            pdia_fp.setVisibility(View.VISIBLE);

        }

        @Override
        protected void onProgressUpdate(Void... values) {}
    }

    public boolean CheckEmail()
    {
        boolean valid = false;
        String email = infw.getText().toString().trim();
        String emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";
        if (email.matches(emailPattern))
            valid = true;
        else
            valid = false;

        return valid;
    }


}
