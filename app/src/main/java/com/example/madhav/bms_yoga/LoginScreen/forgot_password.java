package com.example.madhav.bms_yoga.LoginScreen;


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
        disF = view.findViewById(R.id.imageViewF_close);

        infwb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                fpw();
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
                        Toast.makeText(getContext(), "Email Sent Successfully",
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
                        Toast.makeText(getContext(), "Failed",
                                Toast.LENGTH_LONG).show();
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

}
