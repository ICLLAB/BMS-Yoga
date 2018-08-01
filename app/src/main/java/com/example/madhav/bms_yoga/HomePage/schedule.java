package com.example.madhav.bms_yoga.HomePage;


import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;

import com.example.madhav.bms_yoga.R;

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


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v =  inflater.inflate(R.layout.fragment_schedule, container, false);
        imageView_closeSch = v.findViewById(R.id.imageView_closeSch);
        progB_book = v.findViewById(R.id.progB_book);
        btn_book = v.findViewById(R.id.btn_book);

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
                getDialog().dismiss();
            }
        });
        return v;
    }

}
